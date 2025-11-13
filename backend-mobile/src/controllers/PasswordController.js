// C:\Users\...\backend-mobile\src\controllers\PasswordController.js

import PasswordService from "../services/PasswordService.js";

export default class PasswordController {
    static async forgotPassword(req, reply) {
        try {
            const { email } = req.body;
            if (!email) {
                return reply.status(400).send({ error: 'O campo e-mail é obrigatório.' });
            }
            // O serviço agora sempre retorna uma mensagem genérica por segurança
            await PasswordService.sendResetEmail(email);
            return reply.status(200).send({ message: 'Se um usuário com este e-mail existir em nosso sistema, um código de redefinição foi enviado.' });
        } catch (error) {
            console.error('Erro em forgotPassword:', error);
            return reply.status(500).send({ error: 'Ocorreu um erro interno ao processar a solicitação.' });
        }
    }

    static async resetPassword(req, reply) {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return reply.status(400).send({ error: 'Token e nova senha são obrigatórios.' });
            }
            if (newPassword.length < 6) {
                return reply.status(400).send({ error: 'A senha deve ter no mínimo 6 caracteres.' });
            }

            const result = await PasswordService.resetPassword(token, newPassword);
            return reply.status(200).send(result);
        } catch (error) {
            // Captura erros específicos do serviço para dar feedback claro ao usuário
            if (error.message.includes('Token inválido ou expirado')) {
                return reply.status(400).send({ error: error.message });
            }
            console.error("Erro em resetPassword:", error);
            return reply.status(500).send({ error: 'Ocorreu um erro interno ao redefinir a senha.' });
        }
    }
}