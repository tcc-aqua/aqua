import nodemailer from 'nodemailer';

// Converte a porta para número a partir do .env
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10);

// Cria o transporter. A opção 'secure' será 'true' se a porta for 465.
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendPasswordResetEmail = async (to, token) => {
    const mailOptions = {
        from: `"Aqua Services" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Seu Código de Redefinição de Senha - Aqua Services',
        html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Redefinição de Senha</title>
            <style>
                body { margin: 0; padding: 0; background-color: #f4f7f6; }
                table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
                table { border-collapse: collapse !important; }
            </style>
        </head>
        <body style="margin: 0 !important; padding: 0 !important; background-color: #f4f7f6;">
            <!-- Texto de Preheader (visível na prévia do e-mail) -->
            <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                Seu código de verificação da Aqua Services está aqui.
            </div>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 40px 15px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            
                            <!-- HEADER -->
                            <tr>
                                <td align="center" style="padding: 30px 20px; background-color: #007bff; border-radius: 12px 12px 0 0;">
                                    <h1 style="font-family: 'Arial Black', Gadget, sans-serif; font-size: 32px; color: #ffffff; margin: 0; letter-spacing: 1px;">Aqua Services</h1>
                                </td>
                            </tr>
                            
                            <!-- CORPO DO CONTEÚDO -->
                            <tr>
                                <td align="left" style="padding: 40px 30px; background-color: #ffffff; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                                    <h2 style="font-family: Arial, sans-serif; font-size: 24px; color: #333333; margin: 0 0 20px;">Redefinição de Senha</h2>
                                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 25px;">
                                        Olá,
                                    </p>
                                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555555; line-height: 1.6; margin: 0 0 25px;">
                                        Recebemos uma solicitação para redefinir a senha da sua conta. Para continuar, use o código de verificação abaixo no seu aplicativo.
                                    </p>
                                    
                                    <!-- CAIXA DO CÓDIGO -->
                                    <table border="0" cellspacing="0" cellpadding="0" width="100%">
                                        <tr>
                                            <td align="center" style="background-color: #f0f5ff; border-radius: 8px; border: 2px dashed #a0c4ff; padding: 25px 20px;">
                                                <p style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold; letter-spacing: 6px; margin: 0; color: #004aad;">
                                                    ${token}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #777777; line-height: 1.6; margin: 25px 0 0; text-align: center;">
                                        Este código expira em <strong>10 minutos</strong>.
                                    </p>
                                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555555; line-height: 1.6; margin: 30px 0 0;">
                                        Se você não solicitou esta alteração, pode ignorar este e-mail com segurança.
                                    </p>
                                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555555; line-height: 1.6; margin: 30px 0 0;">
                                        Atenciosamente,<br>Equipe Aqua Services
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- RODAPÉ -->
                            <tr>
                                <td align="center" style="padding: 30px 10px 0;">
                                    <p style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; margin: 0;">
                                        © 2025 Aqua Services. Todos os direitos reservados.
                                    </p>
                                    <p style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; margin: 5px 0 0;">
                                        Esta é uma mensagem automática, por favor, não responda.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail de redefinição enviado com sucesso para: ${to}`);
    } catch (error) {
        console.error('ERRO DETALHADO AO ENVIAR E-MAIL:', error);
        throw new Error('Falha na comunicação com o servidor de e-mail. Verifique as credenciais e a configuração de porta/segurança.');
    }
};

export { sendPasswordResetEmail };