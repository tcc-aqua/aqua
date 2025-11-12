
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
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''),
    },
});

// A função continua a mesma
const sendPasswordResetEmail = async (to, token) => {
    const mailOptions = {
        from: `"Aqua Services" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Redefinição de Senha - Aqua Services',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #0A84FF; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Aqua Services</h1>
            </div>
            <div style="padding: 30px;">
                <h2 style="color: #0A84FF;">Redefinição de Senha</h2>
                <p>Olá,</p>
                <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se você não fez esta solicitação, pode ignorar este e-mail com segurança.</p>
                <p>Para criar uma nova senha, utilize o código de verificação abaixo no seu aplicativo:</p>
                <div style="background-color: #f2f2f7; text-align: center; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 0; color: #1C1C1E;">${token}</p>
                </div>
                <p>Este código de redefinição expirará em <strong>10 minutos</strong>.</p>
                <p>Atenciosamente,<br>Equipe Aqua Services</p>
            </div>
            <div style="background-color: #f2f2f7; color: #8A8A8E; padding: 15px; text-align: center; font-size: 12px;">
                <p style="margin: 0;">© 2025 Aqua Services. Todos os direitos reservados.</p>
            </div>
        </div>
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