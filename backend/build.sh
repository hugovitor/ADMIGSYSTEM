#!/bin/bash
# Este script é executado pelo Render durante o build

# Restore packages
echo "Restaurando pacotes..."
dotnet restore

# Run migrations
echo "Executando migrations..."
dotnet ef database update --no-build

echo "Build concluído!"