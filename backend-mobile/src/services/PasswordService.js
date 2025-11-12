// C:\Users\...\backend-mobile\src\services\PasswordService.js

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { sendPasswordResetEmail } from './EmailService.js'; 

export default class PasswordService {
    static async sendResetEmail(email) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`Tentativa de reset para e-mail não cadastrado: ${email}`);
            return { message: 'Se um usuário com este e-mail existir, um código foi enviado.' };
        }

        const token = crypto.randomInt(100000, 999999).toString();
        const expira_em = new Date(Date.now() + 10 * 60 * 1000);

        await PasswordReset.destroy({ where: { user_id: user.id } });
        await PasswordReset.create({ user_id: user.id, token, expira_em });

        await sendPasswordResetEmail(user.email, token);

        return { message: 'E-mail de redefinição enviado com sucesso!' };
    }

    static async resetPassword(token, newPassword) {
        const reset = await PasswordReset.findOne({ where: { token } });

        if (!reset || reset.expira_em < new Date()) {
            if (reset) await reset.destroy();
            throw new Error('Token inválido ou expirado. Por favor, solicite um novo.');
        }

        const user = await User.findByPk(reset.user_id);
        if (!user) throw new Error("Usuário não encontrado.");

        // <-- CORREÇÃO PRINCIPAL AQUI
        // Atribuímos a nova senha em texto plano.
        // O hook 'beforeUpdate' no modelo User.js se encarregará de fazer o hash.
        user.password = newPassword;
        
        // Ao chamar .save(), o hook será ativado e fará o hash corretamente.
        await user.save();

        await reset.destroy(); // Remove o token após o uso
        return { message: 'Senha redefinida com sucesso!' };
    }
}