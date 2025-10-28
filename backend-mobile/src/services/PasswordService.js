import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import nodemailer from 'nodemailer';

export default class PasswordService {
    static async sendResetEmail(email) {
        try {

            const user = await User.findOne({ where: { email } });
            if (!user) throw new Error('Usuário não encontrado');
            
            const token = uuidv4(); // token unico
        const expira_em = new Date(Date.now() + 3600 * 1000); // 1hr
        
        await PasswordReset.create({ user_id: user_id, token, expira_em: expira_em });
        
        const transporter = nodemailer.createTransport({
            host: 'thdrk.21@gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'thdrk.21@gmail.com',
                pass: '123456'
            }
        })

        const resetUrl = `http://localhost:5181/reset-password?token=${token}`
        await transporter.sendMail({
            from: '"Suporte" <suporte@exemplo.com>',
            to: user.email,
            subject: 'Redefinição de senha',
            html: `<p>Você solicitou redefinição de senha.</p>
            <p>Clique no link para redefinir: <a href="${resetUrl}">${resetUrl}</a></p>
            <p>O link expira em 1 hora.</p>`
        });

        return { message: 'Email enviado com sucesso!' };
    } catch (error) {
        console.error('Erro ao receber email', error);
        throw error;
    }
    }
    
    static async resetPassword(token, newPassword) {
        try {
            const reset = await PasswordReset.findOne({ where: token });
            if (!reset || reset.expira_em < new Date()) throw new Error('Token inválido ou expirado')

            const user = await User.findByPk(reset.user_id);
            if (!user) throw new Error("Usuário não encontrado");


            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            await reset.destroy();
            return { message: 'Senha redefinida com sucesso!' };
        } catch (error) {
            console.error("Erro ao atualizar senha", error);
            throw error;
        }
    }
}