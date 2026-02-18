using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using ChurchManagement.Data;
using ChurchManagement.Services;
using Npgsql.EntityFrameworkCore.PostgreSQL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Church Management API",
        Version = "v1",
        Description = "API para gerenciamento de atividades da igreja (Escola de Música, Jiu-Jitsu e Grupo de Homens)",
        Contact = new OpenApiContact
        {
            Name = "Sistema de Gerenciamento de Igreja",
            Email = "admin@igreja.com"
        }
    });

    // Configurar autenticação JWT no Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insira o token JWT no formato: Bearer {seu token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
var forceSlite = Environment.GetEnvironmentVariable("FORCE_SQLITE");

Console.WriteLine("=== DATABASE DIAGNOSTIC ===");
Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"DATABASE_URL exists: {!string.IsNullOrEmpty(databaseUrl)}");
Console.WriteLine($"DATABASE_URL (first 30 chars): {(string.IsNullOrEmpty(databaseUrl) ? "NULL" : databaseUrl.Substring(0, Math.Min(30, databaseUrl.Length)) + "...")}");
Console.WriteLine($"FORCE_SQLITE: {forceSlite}");
Console.WriteLine($"DefaultConnection: {connectionString}");
Console.WriteLine("==============================");

// Force PostgreSQL if we're on Render (even without DATABASE_URL set)
var renderHost = Environment.GetEnvironmentVariable("RENDER_SERVICE_NAME");
var isRender = !string.IsNullOrEmpty(renderHost) || 
               !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("RENDER")) ||
               !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("RENDER_SERVICE_ID"));

Console.WriteLine($"Render detection: ServiceName={renderHost}, IsRender={isRender}");

if (forceSlite == "true")
{
    // Explicitly forced SQLite
    Console.WriteLine("🔥 DECISION: Using SQLite (FORCED by FORCE_SQLITE=true)");
    Console.WriteLine($"🔥 SQLite Connection: {connectionString}");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(connectionString));
}
else if (!string.IsNullOrEmpty(databaseUrl))
{
    // PostgreSQL with DATABASE_URL 
    Console.WriteLine("✅ DECISION: Using PostgreSQL (DATABASE_URL provided)");
    Console.WriteLine($"✅ Original DATABASE_URL length: {databaseUrl.Length}");
    connectionString = ConvertPostgresUrl(databaseUrl);
    Console.WriteLine($"✅ Converted connection string length: {connectionString.Length}");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(connectionString));
}
else if (isRender)
{
    // We're on Render but no DATABASE_URL - this is the problem!
    Console.WriteLine("🚨 PROBLEM DETECTED: On Render but no DATABASE_URL!");
    Console.WriteLine("🚨 This means PostgreSQL wasn't configured properly in Render dashboard");
    Console.WriteLine("🚨 Falling back to SQLite - DATA WILL BE LOST ON RESTART!");
    Console.WriteLine($"🔥 SQLite Connection: {connectionString}");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(connectionString));
}
else
{
    // Default to SQLite
    Console.WriteLine("🔥 DECISION: Using SQLite (default fallback)");
    Console.WriteLine($"🔥 REASON: Not production OR no DATABASE_URL");
    Console.WriteLine($"🔥 IsProduction: {builder.Environment.IsProduction()}");
    Console.WriteLine($"🔥 SQLite Connection: {connectionString}");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(connectionString));
}

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization();

// Services
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<PdfService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            // Production CORS
            var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
            var originsList = allowedOrigins.ToList();
            
            // Always include the current host (same-origin requests)
            var currentHost = builder.Configuration["ASPNETCORE_URLS"] ?? "https://church-management-backend-7owp.onrender.com";
            var renderHost = "https://church-management-backend-7owp.onrender.com";
            
            if (!originsList.Contains(renderHost))
            {
                originsList.Add(renderHost);
            }
            
            Console.WriteLine($"CORS Origins configured: {string.Join(", ", originsList)}");
            
            if (originsList.Count > 0)
            {
                policy.WithOrigins(originsList.ToArray())
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            }
            else
            {
                // Fallback - allow any origin in production if not configured
                policy.AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            }
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Church Management API v1");
    options.RoutePrefix = "swagger";
    options.DocumentTitle = "Church Management API - Documentação";
    
    // Deep Linking - permite navegar diretamente para endpoints específicos
    options.EnableDeepLinking();
    
    // Display request duration
    options.DisplayRequestDuration();
    
    // Outras melhorias de UX
    options.DefaultModelsExpandDepth(2);
    options.DefaultModelExpandDepth(2);
    options.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
    options.EnableFilter();
    options.ShowExtensions();
});

app.UseCors("AllowFrontend");

// Configurar arquivos estáticos
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Initialize database and seed admin user
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Check if we should reset database completely (for troubleshooting)
    var resetDatabase = Environment.GetEnvironmentVariable("RESET_DATABASE");
    var forceDbCreate = Environment.GetEnvironmentVariable("FORCE_DB_CREATE");
    
    Console.WriteLine("=== DATABASE INITIALIZATION ===");
    Console.WriteLine($"Database initialization - Reset: {resetDatabase}, Force: {forceDbCreate}, HasDatabaseUrl: {!string.IsNullOrEmpty(databaseUrl)}");
    Console.WriteLine($"Environment.IsProduction(): {app.Environment.IsProduction()}");
    Console.WriteLine("==============================");
    
    try
    {
        if (resetDatabase == "true")
        {
            Console.WriteLine("RESET_DATABASE=true detected. Deleting and recreating database...");
            await context.Database.EnsureDeletedAsync();
            await context.Database.EnsureCreatedAsync();
        }
        else if (forceDbCreate == "true" || string.IsNullOrEmpty(databaseUrl))
        {
            Console.WriteLine($"Force creating database. Reason: ForceCreate={forceDbCreate}, NoDatabaseUrl={string.IsNullOrEmpty(databaseUrl)}");
            await context.Database.EnsureCreatedAsync();
        }
        else
        {
            Console.WriteLine("Running migrations...");
            await context.Database.MigrateAsync();
        }
        
        Console.WriteLine("Database setup completed successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database setup failed: {ex.Message}.");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        
        try
        {
            Console.WriteLine("Attempting fallback: EnsureCreated...");
            await context.Database.EnsureCreatedAsync();
            Console.WriteLine("Fallback successful.");
        }
        catch (Exception fallbackEx)
        {
            Console.WriteLine($"Fallback also failed: {fallbackEx.Message}");
            throw; // Re-throw the original exception
        }
    }
    
    try
    {
        await DbInitializer.SeedData(context);
        Console.WriteLine("Database seeding completed.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database seeding failed: {ex.Message}");
        // Don't throw here - app can still work without seeded data
    }
}

// Configure port for deployment
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://0.0.0.0:{port}");

app.Run();

// Helper method to convert DATABASE_URL to PostgreSQL connection string
static string ConvertPostgresUrl(string databaseUrl)
{
    try
    {
        Console.WriteLine($"Converting DATABASE_URL: {databaseUrl}");
        
        var uri = new Uri(databaseUrl);
        var db = uri.AbsolutePath.Trim('/');
        var userInfo = uri.UserInfo.Split(':');
        var user = userInfo[0];
        var password = userInfo.Length > 1 ? userInfo[1] : "";
        var host = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 5432; // Default PostgreSQL port
        
        var connectionString = $"Host={host};Port={port};Database={db};Username={user};Password={password};SSL Mode=Require;Trust Server Certificate=true";
        Console.WriteLine($"Generated connection string: Host={host};Port={port};Database={db};Username={user};Password=***");
        
        return connectionString;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error converting DATABASE_URL: {ex.Message}");
        throw new InvalidOperationException($"Failed to parse DATABASE_URL: {ex.Message}", ex);
    }
}
