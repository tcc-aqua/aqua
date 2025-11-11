const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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
    } catch (error) {
        console.error('Erro ao enviar e-mail de redefinição de senha:', error);
        throw new Error('Não foi possível enviar o e-mail de redefinição de senha.');
    }
};

module.exports = { sendPasswordResetEmail };