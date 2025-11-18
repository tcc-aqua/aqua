// Arquivo: C:\Users\24250553\Documents\3mdR\aqua\backend-mobile\src\controllers\UserController.js
// CÓDIGO COMPLETO E CORRIGIDO

import UserService from "../services/UserService.js";

export default class UserController {
    static async updateMe(req, reply) {
        const userId = req.user.id;
        const user = await UserService.updateMe(userId, req.body);
        return reply.status(200).send({ message: 'Perfil atualizado com sucesso!', user });
    }

    // NOVO MÉTODO PARA RECEBER O UPLOAD
    static async uploadProfile(req, reply) {
        try {
            const userId = req.user.id;
            const file = await req.file();

            if (!file) {
                return reply.status(400).send({ error: 'Nenhum arquivo enviado.' });
            }

            const imageUrl = await UserService.uploadProfilePicture(userId, file);

            return reply.status(200).send({
                message: 'Foto de perfil atualizada com sucesso!',
                img_url: imageUrl
            });
        } catch (error) {
            console.error('Erro no controller de upload:', error);
            return reply.status(500).send({ error: 'Erro interno ao salvar a imagem.' });
        }
    }

    static async getStats(req, reply) {
        const userId = req.user.id;
        const stats = await UserService.getUserStats(userId);
        return reply.status(200).send(stats);
    }
}