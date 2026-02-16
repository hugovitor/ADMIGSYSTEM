using ChurchManagement.Services;
using ChurchManagement.Models;
using Microsoft.Extensions.FileProviders;

namespace ChurchManagement.Test
{
    public class PdfServiceTest
    {
        public static void TestPdfGeneration()
        {
            try
            {
                // Criar um ambiente mock simples
                var environment = new MockWebHostEnvironment();
                var pdfService = new PdfService(environment);
                
                // Criar dados de teste
                var presentation = new ChildPresentation
                {
                    Id = 1,
                    ChildName = "João Silva",
                    BirthDate = DateTime.Parse("2022-01-15"),
                    Gender = "Masculino",
                    BirthPlace = "São Paulo, SP",
                    FatherName = "José Silva",
                    MotherName = "Maria Silva",
                    PresentationDate = DateTime.Now,
                    ChurchName = "Igreja Teste",
                    Pastor = "Pastor Teste"
                };

                Console.WriteLine("Testando geração de PDF...");
                var pdfBytes = pdfService.GenerateChildPresentationCertificate(presentation);
                Console.WriteLine($"PDF gerado com sucesso! Tamanho: {pdfBytes.Length} bytes");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }
    }

    public class MockWebHostEnvironment : IWebHostEnvironment
    {
        public string WebRootPath { get; set; } = @"E:\Projects\ADMIGSYSTEM\backend\wwwroot";
        public string ContentRootPath { get; set; } = @"E:\Projects\ADMIGSYSTEM\backend";
        public string EnvironmentName { get; set; } = "Development";
        public string ApplicationName { get; set; } = "ChurchManagement";
        public IFileProvider? WebRootFileProvider { get; set; }
        public IFileProvider? ContentRootFileProvider { get; set; }
    }
}