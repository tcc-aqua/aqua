import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const gerarToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const Login = async (req, reply) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return reply.status(404).send({ message: 'Administrador não encontrado.' });
        }

        if (admin.status !== 'ativo') {
            return reply.status(403).send({ message: 'Administrador inativo.' });
        }

        const senhaCorreta = await admin.checkPassword(password);

        if (!senhaCorreta) {
            return reply.status(401).send({ message: 'Senha incorreta.' });
        }

        const token = gerarToken({
            id: admin.id,
            email: admin.email,
            type: admin.type
        });

        return reply.status(200).send({
            message: 'Login efetuado com sucesso!',
            token
        });

    } catch (error) {
        console.error("Erro ao efetuar login:", error);
        return reply.status(500).send({ message: 'Erro ao efetuar login.' });
    }
};
