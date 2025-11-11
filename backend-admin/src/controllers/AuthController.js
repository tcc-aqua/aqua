import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const gerarToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Blacklist de tokens 
const tokenBlacklist = new Set();


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
}

export const Logout = async (req, reply) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return reply.status(400).send({ message: 'Token não fornecido.' });
        }

        const token = authHeader.split(' ')[1]; // espera "Bearer <token>"

        // adiciona o token na blacklist
        tokenBlacklist.add(token);

        return reply.status(200).send({ message: 'Logout realizado com sucesso.' });
    } catch (error) {
        console.error("Erro ao efetuar logout:", error);
        return reply.status(500).send({ message: 'Erro ao efetuar logout.' });
    }
};

export const verifyToken = async (req, reply, done) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return reply.status(401).send({ message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    if (tokenBlacklist.has(token)) {
        return reply.status(401).send({ message: 'Token inválido (logout realizado).' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        done();
    } catch (error) {
        return reply.status(401).send({ message: 'Token inválido ou expirado.' });
    }
};

export const getMe = async (req, reply) => {
    try {
        const admin = await Admin.findByPk(req.admin.id);

        if (!admin) {
            return reply.status(404).send({ message: 'Administrador não encontrado.' });
        }

        const adminData = admin.toJSON();
        delete adminData.password;

        // retornando sem a senha
        return reply.status(200).send(adminData);

    } catch (error) {
        console.error("Erro ao listar dados do administrador:", error);
        return reply.status(500).send({ message: 'Erro ao listar dados do administrador.' });
    }
};

