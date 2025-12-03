import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definição dos arquivos e conteúdos
const files = {
  'src/dtos/condominio/condominioDTO.js': `import { z } from "zod";

export const registerCondominioSchema = z.object({
    sindico: z.object({
        name: z.string().min(3),
        email: z.string().email(),
        cpf: z.string().min(11),
        password: z.string().min(6)
    }),
    condominio: z.object({
        name: z.string().min(3),
        cep: z.string().min(8),
        numero: z.string(),
        logradouro: z.string().optional(),
        bairro: z.string().optional(),
        cidade: z.string().optional(),
        uf: z.string().length(2).optional()
    })
});`,

  'src/services/CondominioService.js': `import Condominio from "../models/Condominio.js";
import User from "../models/User.js";
import CepService from "./CepService.js";
import { nanoid } from "nanoid";
import sequelize from "../config/sequelize.js";

export default class CondominioService {
    static async create(data) {
        const transaction = await sequelize.transaction();

        try {
            const { sindico, condominio } = data;

            const existingUser = await User.findOne({ where: { email: sindico.email }, transaction });
            if (existingUser) {
                throw new Error("E-mail já cadastrado.");
            }

            const existingCpf = await User.findOne({ where: { cpf: sindico.cpf }, transaction });
            if (existingCpf) {
                throw new Error("CPF já cadastrado.");
            }

            let endereco = { ...condominio };
            if (!condominio.logradouro || !condominio.cidade) {
                const cepData = await CepService.buscarCep(condominio.cep);
                endereco = {
                    ...condominio,
                    logradouro: cepData.logradouro,
                    bairro: cepData.bairro,
                    cidade: cepData.cidade,
                    uf: cepData.uf
                };
            }

            const userSindico = await User.create({
                name: sindico.name,
                email: sindico.email,
                cpf: sindico.cpf,
                password: sindico.password,
                type: 'condominio',
                role: 'sindico',
                status: 'ativo',
                residencia_type: 'apartamento' 
            }, { transaction });

            const newCondominio = await Condominio.create({
                name: condominio.name,
                logradouro: endereco.logradouro,
                numero: condominio.numero,
                bairro: endereco.bairro,
                cidade: endereco.cidade,
                uf: endereco.uf,
                estado: endereco.uf, 
                cep: condominio.cep,
                codigo_acesso: nanoid(6).toUpperCase(),
                sindico_id: userSindico.id,
                status: 'ativo'
            }, { transaction });

            await transaction.commit();

            const sindicoResponse = userSindico.toJSON();
            delete sindicoResponse.password;

            return {
                message: "Condomínio e Síndico criados com sucesso!",
                condominio: newCondominio,
                sindico: sindicoResponse
            };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async getAll() {
        return await Condominio.findAll();
    }
}`,

  'src/controllers/CondominioController.js': `import CondominioService from "../services/CondominioService.js";
import { registerCondominioSchema } from "../dtos/condominio/condominioDTO.js";

export default class CondominioController {
    static async create(req, reply) {
        try {
            const data = registerCondominioSchema.parse(req.body);
            const result = await CondominioService.create(data);
            return reply.status(201).send(result);
        } catch (error) {
            if (error?.issues) {
                return reply.status(400).send({ errors: error.issues });
            }
            return reply.status(400).send({ error: error.message });
        }
    }

    static async getAll(req, reply) {
        try {
            const condominios = await CondominioService.getAll();
            return reply.status(200).send(condominios);
        } catch (error) {
            return reply.status(500).send({ error: error.message });
        }
    }
}`,

  'src/routes/condominio.routes.js': `import CondominioController from "../controllers/CondominioController.js";

export default async function condominioRoutes(fastify) {
    fastify.post('/', {
        schema: {
            summary: 'Registrar novo condomínio',
            tags: ['condominios'],
            description: 'Cria um novo condomínio e o usuário síndico responsável.'
        }
    }, CondominioController.create);

    fastify.get('/', {
        schema: {
            summary: 'Listar condomínios',
            tags: ['condominios'],
            description: 'Lista todos os condomínios cadastrados.'
        }
    }, CondominioController.getAll);
}`,

  'src/app.js': `import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import { fastifySwagger } from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import pino from 'pino';
import fs from 'fs';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import apartamentoRoutes from './routes/apartamento.routes.js';
import dicaRoutes from './routes/dica.routes.js';
import userRoutes from './routes/user.routes.js';
import passwordRoutes from './routes/password.routes.js';
import cepRoutes from './routes/cep.routes.js';
import metasRoutes from './routes/metas.routes.js';
import profileRoutes from './routes/profile.routes.js';
import comunicadosRoutes from './routes/comunicados.routes.js';
import casaRoutes from './routes/casa.routes.js';
import condominioRoutes from './routes/condominio.routes.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.resolve(__dirname, '..', 'uploads');
const logsPath = path.resolve(__dirname, '..', 'logs');

console.log('------------------------------------------------');
console.log('📁 SERVIDOR DE IMAGENS LENDO DE:', uploadsPath);
console.log('------------------------------------------------');

if (!fs.existsSync(logsPath)) fs.mkdirSync(logsPath, { recursive: true });
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

const date = new Date().toISOString().slice(0, 10);
const filePath = path.join(logsPath, \`\${date}.log\`);
const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

const prettyTransport = pino.transport({
    target: 'pino-pretty',
    options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
    },
});

const multiStream = pino.multistream([
    { stream: prettyTransport },
    { stream: fileStream },
]);

const fastify = Fastify({
    logger: {
        level: 'info',
        stream: multiStream
    }
});

await fastify.register(cors, {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
});

fastify.register(fastifyFormbody);
await fastify.register(multipart);

fastify.register(fastifyStatic, {
    root: uploadsPath,
    prefix: '/api/uploads/',
    list: false,
});

await fastify.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Aqua API Mobile',
            version: '1.0.0',
            description: 'Documentação da nossa API Mobile do Sistema Aqua.'
        },
    }
});

await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    },
    initOAuth: {},
});

fastify.get('/api', (req, reply) => {
    return reply.status(200).send('Hello Mobile!');
});

fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(apartamentoRoutes, { prefix: '/api/apartamentos' });
fastify.register(casaRoutes, { prefix: '/api/casas' });
fastify.register(dicaRoutes, { prefix: '/api/dica' });
fastify.register(userRoutes, { prefix: '/api/user' });
fastify.register(metasRoutes, { prefix: '/api/metas' });
fastify.register(cepRoutes, { prefix: '/api/cep' });
fastify.register(profileRoutes, { prefix: '/api/profile' });
fastify.register(passwordRoutes, { prefix: '/api/password' });
fastify.register(comunicadosRoutes, { prefix: '/api/comunicados' });
fastify.register(condominioRoutes, { prefix: '/api/condominios' });

export default fastify;`
};

async function createFiles() {
  console.log('🚀 Iniciando criação dos arquivos de Condomínio...');
  
  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.resolve(__dirname, relativePath);
    const dir = path.dirname(fullPath);

    // Garante que a pasta existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Pasta criada: ${dir}`);
    }

    // Escreve o arquivo
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Arquivo criado/atualizado: ${relativePath}`);
  }

  console.log('\n✨ Tudo pronto! Funcionalidade de Condomínio instalada.');
  console.log('👉 Agora rode: npm run start (ou node src/server.js)');
}

createFiles();