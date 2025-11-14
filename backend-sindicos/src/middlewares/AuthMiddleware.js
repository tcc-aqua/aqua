import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const autenticarSindico = async (request, reply) => {
  try {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return reply.status(401).send({ message: 'Token não fornecido.' });

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return reply.status(401).send({ message: 'Token inválido.' });

    const decoded = jwt.verify(token.replace(/"/g, ''), process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user || user.status !== 'ativo' || user.role !== 'sindico') {
      return reply.status(403).send({ message: 'Acesso negado.' });
    }

    request.user = user; 
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return reply.status(401).send({ message: 'Token inválido ou expirado.' });
  }
};
