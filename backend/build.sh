#!/bin/bash
# Este script é executado pelo Render durante o build

echo "Iniciando build..."

# Install EF Core CLI tools
echo "Instalando EF Core tools..."
dotnet tool install --global dotnet-ef || echo "EF tools já instalados"

# Add .NET tools to PATH
export PATH="$PATH:$HOME/.dotnet/tools"

# Restore packages
echo "Restaurando pacotes..."
dotnet restore

# Build in release mode
echo "Building application..."
dotnet build --configuration Release --no-restore

echo "Build concluído!"