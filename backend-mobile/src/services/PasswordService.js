import bcrypt from 'bcryptjs';
import crypto from 'crypto'; // Usaremos o crypto nativo do Node.js
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';

export default class PasswordService {
    static async sendResetEmail(email) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Por segurança, não informamos que o usuário não existe.
            // A lógica continua para não vazar informações de quais e-mails são cadastrados.
            console.log(`Tentativa de reset para e-mail não cadastrado: ${email}`);
            return { message: 'Se um usuário com este e-mail existir, um código foi enviado.' };
        }

        // 1. Gera um código numérico de 6 dígitos, fácil de digitar no celular.
        const token = crypto.randomInt(100000, 999999).toString();
        const expira_em = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos de validade

        // Destroi tokens antigos para evitar múltiplos códigos válidos
        await PasswordReset.destroy({ where: { user_id: user.id } });
        await PasswordReset.create({ user_id: user.id, token, expira_em });

        // 2. Configura o Nodemailer para usar as credenciais do GMAIL do seu .env
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // para a porta 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 3. Monta um e-mail com visual profissional
        const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #0A84FF; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Aqua Services</h1>
            </div>
            <div style="padding: 30px;">
                <h2 style="color: #0A84FF;">Redefinição de Senha</h2>
                <p>Olá,</p>
                <p>Recebemos uma solicitação para redefinir a senha da sua conta. Utilize o código de verificação abaixo no seu aplicativo:</p>
                <div style="background-color: #f2f2f7; text-align: center; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 0; color: #1C1C1E;">${token}</p>
                </div>
                <p>Este código expira em <strong>10 minutos</strong>. Se você não solicitou isso, pode ignorar este e-mail.</p>
                <p>Atenciosamente,<br>Equipe Aqua Services</p>
            </div>
            <div style="background-color: #f2f2f7; color: #8A8A8E; padding: 15px; text-align: center; font-size: 12px;">
                <p style="margin: 0;">© 2025 Aqua Services. Todos os direitos reservados.</p>
            </div>
        </div>`;

        await transporter.sendMail({
            from: `"Aqua Services" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Seu código de redefinição de senha - Aqua Services',
            html: emailHtml
        });

        return { message: 'Email de redefinição enviado com sucesso!' };
    }

    static async resetPassword(token, newPassword) {
        const reset = await PasswordReset.findOne({ where: { token } });

        if (!reset || reset.expira_em < new Date()) {
            // Se o token não existe ou já expirou
            if (reset) await reset.destroy(); // Limpa o token expirado do banco
            throw new Error('Token inválido ou expirado. Por favor, solicite um novo.');
        }

        const user = await User.findByPk(reset.user_id);
        if (!user) throw new Error("Usuário não encontrado.");

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        await reset.destroy(); // Remove o token após o uso
        return { message: 'Senha redefinida com sucesso!' };
    }
}