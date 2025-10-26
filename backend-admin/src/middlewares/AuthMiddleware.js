import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const autenticarAdmin = async (req, reply) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return reply.status(401).send({ message: 'Token não fornecido.' });
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return reply.status(401).send({ message: 'Token inválido.' });
        }

        const token = parts[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await Admin.findByPk(decoded.id);

        if (!admin || admin.status !== 'ativo') {
            return reply.status(401).send({ message: 'Administrador inválido ou inativo.' });
        }

        req.admin = admin;

    } catch (error) {
        console.error("Erro na autenticação:", error);
        return reply.status(401).send({ message: 'Token inválido ou expirado.' });
    }
};
