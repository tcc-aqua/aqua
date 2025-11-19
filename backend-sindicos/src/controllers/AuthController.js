import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ------------------------------
// TOKEN
// ------------------------------
const gerarToken = (user) => {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Blacklist na memória (temporário)
const tokenBlacklist = new Set();

// ------------------------------
// LOGIN
// ------------------------------
export const Login = async (req, reply) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return reply.code(404).send({ message: 'Síndico não encontrado.' });
        }

        if (user.status !== 'ativo') {
            return reply.code(403).send({ message: 'Síndico inativo.' });
        }

        if (user.role !== 'sindico') {
            return reply.code(403).send({ message: 'Esse usuário não é um síndico.' });
        }

        if (!user.checkPassword || !(await user.checkPassword(password))) {
            return reply.code(401).send({ message: 'Senha incorreta.' });
        }

        const token = gerarToken(user);

        return reply.code(200).send({
            message: 'Login efetuado com sucesso!',
            token
        });

    } catch (error) {
        console.error("Erro ao efetuar login:", error);
        return reply.code(500).send({ message: 'Erro ao efetuar login.' });
    }
};

// ------------------------------
// LOGOUT
// ------------------------------
export const Logout = async (req, reply) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return reply.code(400).send({ message: 'Token não fornecido.' });
        }

        const token = authHeader.split(' ')[1];

        tokenBlacklist.add(token); // remover depois no Redis

        return reply.code(200).send({ message: 'Logout realizado com sucesso.' });

    } catch (error) {
        console.error("Erro ao efetuar logout:", error);
        return reply.code(500).send({ message: 'Erro ao efetuar logout.' });
    }
};

// ------------------------------
// MIDDLEWARE DE AUTENTICAÇÃO
// ------------------------------
export const verifyToken = async (req, reply) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return reply.code(401).send({ message: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    if (tokenBlacklist.has(token)) {
        return reply.code(401).send({ message: 'Token inválido (logout realizado).' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // sub, email, role
    } catch (error) {
        return reply.code(401).send({ message: 'Token inválido ou expirado.' });
    }
};

// ------------------------------
// GET ME
// ------------------------------
export const getMe = async (req, reply) => {
    try {
        const user = await User.findByPk(req.user.sub);

        if (!user) {
            return reply.code(404).send({ message: 'Síndico não encontrado.' });
        }

        const data = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role,
            status: user.status
        };

        return reply.code(200).send(data);

    } catch (error) {
        console.error("Erro ao listar dados do administrador:", error);
        return reply.code(500).send({ message: 'Erro ao listar dados do administrador.' });
    }
};
