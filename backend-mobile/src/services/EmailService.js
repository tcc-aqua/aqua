import nodemailer from 'nodemailer';

const EMAIL_PORT = parseInt(process.env.EMAIL_PORT, 10) || 465;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
    keepAlive: true, 
    timeout: 10000 
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
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: Arial, sans-serif;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td align="center" style="padding: 40px 15px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <tr>
                                <td align="center" style="padding: 30px 20px; background-color: #007bff;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Aqua Services</h1>
                                </td>
                            </tr>
                            <tr>
                                <td align="left" style="padding: 40px 30px;">
                                    <h2 style="color: #333333; margin-top: 0;">Redefinição de Senha</h2>
                                    <p style="color: #555555; font-size: 16px;">Recebemos uma solicitação para redefinir sua senha.</p>
                                    <p style="color: #555555; font-size: 16px;">Seu código de verificação é:</p>
                                    
                                    <div style="background-color: #f0f5ff; border: 2px dashed #004aad; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                                        <span style="font-size: 32px; font-weight: bold; color: #004aad; letter-spacing: 5px;">${token}</span>
                                    </div>

                                    <p style="color: #999999; font-size: 14px; text-align: center;">Válido por 10 minutos.</p>
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
        console.log(`[EmailService] Conectando via porta 465 (SSL) para ${to}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EmailService] Sucesso! ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('[EmailService] Erro no envio:', error);
        throw error;
    }
};

export { sendPasswordResetEmail };