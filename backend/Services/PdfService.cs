using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.IO.Font.Constants;
using iText.Layout.Borders;
using System.Text;
using ChurchManagement.Models;

namespace ChurchManagement.Services
{
    public class PdfService
    {
        private readonly IWebHostEnvironment _environment;

        public PdfService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public byte[] GenerateChildPresentationCertificate(ChildPresentation presentation)
        {
            using (var stream = new MemoryStream())
            {
                // Criar o documento PDF
                var writer = new PdfWriter(stream);
                var pdf = new PdfDocument(writer);
                var document = new Document(pdf);

                // Configurar fonte
                var titleFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
                var bodyFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);
                var decorativeFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_OBLIQUE);

                // Cor principal baseada no sexo
                var primaryColor = presentation.Gender == "Masculino" 
                    ? ColorConstants.BLUE 
                    : new DeviceRgb(255, 20, 147); // Deep Pink

                // Título do certificado
                var title = new Paragraph("CERTIFICADO DE APRESENTAÇÃO")
                    .SetFont(titleFont)
                    .SetFontSize(24)
                    .SetFontColor(primaryColor)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetMarginBottom(30);
                document.Add(title);

                // Linha decorativa
                var line = new Paragraph("═══════════════════════════════")
                    .SetFont(decorativeFont)
                    .SetFontSize(16)
                    .SetFontColor(primaryColor)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetMarginBottom(30);
                document.Add(line);

                // Conteúdo principal
                var genderText = presentation.Gender == "Masculino" ? "o menino" : "a menina";
                var content = new Paragraph($"Certificamos que {genderText}")
                    .SetFont(bodyFont)
                    .SetFontSize(14)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetMarginBottom(10);
                document.Add(content);

                // Nome da criança (destacado)
                var childName = new Paragraph(presentation.ChildName.ToUpper())
                    .SetFont(titleFont)
                    .SetFontSize(20)
                    .SetFontColor(primaryColor)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetMarginBottom(20)
                    .SetBorder(new SolidBorder(primaryColor, 2))
                    .SetPadding(10);
                document.Add(childName);

                // Data de nascimento
                var birthDateFormatted = presentation.BirthDate.ToString("dd/MM/yyyy");
                var birthInfo = new Paragraph("nascido(a) em " + birthDateFormatted)
                    .SetFont(bodyFont)
                    .SetFontSize(12)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetMarginBottom(20);
                document.Add(birthInfo);

                // Informações dos pais
                var parentsInfo = new Paragraph($"filho(a) de {presentation.FatherName} e {presentation.MotherName}")
                    .SetFont(bodyFont)
                    .SetFontSize(12)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetMarginBottom(30);
                document.Add(parentsInfo);

                // Texto principal da apresentação
                var presentationText = new Paragraph("foi apresentado(a) ao Senhor Jesus Cristo nesta igreja em")
                    .SetFont(bodyFont)
                    .SetFontSize(14)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetMarginBottom(10);
                document.Add(presentationText);

                // Data da apresentação
                var presentationDateFormatted = presentation.PresentationDate.ToString("dd/MM/yyyy");
                var presentationDate = new Paragraph(presentationDateFormatted)
                    .SetFont(titleFont)
                    .SetFontSize(16)
                    .SetFontColor(primaryColor)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetMarginBottom(30);
                document.Add(presentationDate);

                // Versículo bíblico
                if (!string.IsNullOrEmpty(presentation.BiblicalVerse))
                {
                    var verse = new Paragraph($"\"{presentation.BiblicalVerse}\"")
                        .SetFont(decorativeFont)
                        .SetFontSize(12)
                        .SetTextAlignment(TextAlignment.CENTER)
                        .SetMarginBottom(30)
                        .SetFontColor(ColorConstants.DARK_GRAY);
                    document.Add(verse);
                }

                // Mensagem especial (se houver)
                if (!string.IsNullOrEmpty(presentation.SpecialMessage))
                {
                    var specialMessage = new Paragraph(presentation.SpecialMessage)
                        .SetFont(bodyFont)
                        .SetFontSize(11)
                        .SetTextAlignment(TextAlignment.CENTER)
                        .SetMarginBottom(30)
                        .SetFontColor(ColorConstants.DARK_GRAY);
                    document.Add(specialMessage);
                }

                // Espaço para assinatura
                document.Add(new Paragraph("\n\n"));

                // Nome da igreja
                var churchName = new Paragraph(presentation.ChurchName)
                    .SetFont(titleFont)
                    .SetFontSize(14)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetMarginBottom(5);
                document.Add(churchName);

                // Endereço da igreja (se houver)
                if (!string.IsNullOrEmpty(presentation.ChurchAddress))
                {
                    var churchAddress = new Paragraph(presentation.ChurchAddress)
                        .SetFont(bodyFont)
                        .SetFontSize(10)
                        .SetTextAlignment(TextAlignment.CENTER)
                        .SetMarginBottom(20);
                    document.Add(churchAddress);
                }

                // Linha para assinatura do pastor
                var signatureLine = new Paragraph("_________________________________")
                    .SetFont(bodyFont)
                    .SetFontSize(12)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetMarginBottom(5);
                document.Add(signatureLine);

                // Nome do pastor
                var pastorName = new Paragraph($"Pastor {presentation.Pastor}")
                    .SetFont(bodyFont)
                    .SetFontSize(12)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetMarginBottom(30);
                document.Add(pastorName);

                // Data de emissão
                var issueDate = new Paragraph($"Emitido em {DateTime.Now.ToString("dd/MM/yyyy")}")
                    .SetFont(bodyFont)
                    .SetFontSize(10)
                    .SetTextAlignment(TextAlignment.RIGHT)
                    .SetFontColor(ColorConstants.GRAY);
                document.Add(issueDate);

                // Fechar o documento
                document.Close();

                return stream.ToArray();
            }
        }

        public async Task<string> SaveCertificateAsync(byte[] pdfData, string fileName)
        {
            var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "certificates");
            
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var filePath = Path.Combine(uploadsPath, fileName);
            await File.WriteAllBytesAsync(filePath, pdfData);

            return Path.Combine("uploads", "certificates", fileName).Replace("\\", "/");
        }
    }
}