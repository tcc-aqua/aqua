import Condominio from "../models/Condominio.js";
import CondominioView from "../models/CondominioView.js";
import AuditLogService from "./AuditLog.js";
import CepService from "./CepService.js";

export default class CondominioService {

    static async getAllCondominios(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['condominio_id', 'DESC']],
            }
            const condomonios = await CondominioView.paginate(options);
            return condomonios;
        } catch (error) {
            console.error('Erro ao buscar condominios', error);
            throw error;
        }
    }

    static async getAllActivesCondominios(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['condominio_id', 'DESC']],
                where: { condominio_status: 'ativo' },
            }
            const condominios = await CondominioView.paginate(options);
            return condominios;
        } catch (error) {
            console.error('Erro ao buscar condominios ativos');
            throw error;
        }
    }

    static async getAllDeactivetedCondominios(page = 1, limit = 10) {
        try {

            const options = {
                page,
                paginate: limit,
                order: [['condominio_id', 'DESC']],
                where: { condominio_status: 'ativo' },
            }
            const condominios = await CondominioView.paginate(options);
            return condominios;

        } catch (error) {
            console.error('Erro ao buscar condominios inativos', error);
            throw error;
        }
    }

    static async getAllApartamentosAtivosDeUmCondominio(id, page = 1, limit = 10) {
        try {
            const condominio = await Condominio.findByPk(id);
            if (!condominio) {
                throw new Error('Condominio não encontrado');
            }

            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
                where: {
                    condominio_id: id,
                    status: 'ativo'
                }
            }

            const apartamentos = await Condominio.paginate(options);
            return apartamentos;
        } catch (error) {
            console.error('Erro ao listar apartamentos ativas do condominio')
        }
    }

    static async countAllCondominios() {
        try {
            const condominiosTotais = await Condominio.count();
            return condominiosTotais;
        } catch (error) {
            console.error('Erro ao contar condominios', error);
            throw error;
        }
    }

    static async createCondominio({ name, numero, cep, sindico_id }) {
        try {
            const endereco = await CepService.buscarCep(cep);

            const condominioExistente = await Condominio.findOne({
                where: { cep: endereco.cep },
            });

            if (condominioExistente) {
                throw new Error(`Já existe um condomínio cadastrado com o CEP ${endereco.cep}`);
            }

            const condominio = await Condominio.create({
                name,
                numero,
                cep: endereco.cep,
                logradouro: endereco.logradouro,
                bairro: endereco.bairro,
                cidade: endereco.cidade,
                uf: endereco.uf,
                sindico_id,
            });

            if (condominio.cep)

                return condominio;
        } catch (error) {
            console.error("Erro ao criar condomínio:", error);
            throw error;
        }
    }

    static async updateNameCondominio(adminId, id, { name }) {
    try {
        const condominio = await Condominio.findByPk(id);
        if (!condominio) throw new Error('Condomínio não encontrado.');

        const valorAntigo = { name: condominio.name };

        await condominio.update({ name });

        const valorNovo = { name };

        await AuditLogService.criarLog({
            user_id: id,
            acao: 'update',
            campo: 'condominio_name',
            valor_antigo: JSON.stringify(valorAntigo),
            valor_novo: JSON.stringify(valorNovo),
            alterado_por: adminId
        });

        return condominio;
    } catch (error) {
        console.error('Erro ao atualizar nome do condomínio', error);
        throw error;
    }
}

static async updateCondominio(id, adminId, { name, numero, cep, sindico_id }) {
    try {
        const endereco = await CepService.buscarCep(cep);

        const condominio = await Condominio.findByPk(id);
        if (!condominio) throw new Error('Condomínio não encontrado.');

        const condominioExistente = await Condominio.findOne({
            where: { cep: endereco.cep },
        });
        if (condominioExistente && condominioExistente.id !== id) {
            throw new Error(`Já existe um condomínio cadastrado com o CEP ${endereco.cep}`);
        }

        const valorAntigo = {
            name: condominio.name,
            numero: condominio.numero,
            cep: condominio.cep,
            sindico_id: condominio.sindico_id,
            logradouro: condominio.logradouro,
            bairro: condominio.bairro,
            cidade: condominio.cidade,
            uf: condominio.uf
        };

        await condominio.update({
            name,
            numero,
            sindico_id,
            cep: endereco.cep,
            logradouro: endereco.logradouro,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            uf: endereco.uf,
        });

        const valorNovo = {
            name,
            numero,
            cep: endereco.cep,
            sindico_id,
            logradouro: endereco.logradouro,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            uf: endereco.uf
        };

        await AuditLogService.criarLog({
            user_id: id,
            acao: 'update',
            campo: 'condominio',
            valor_antigo: JSON.stringify(valorAntigo),
            valor_novo: JSON.stringify(valorNovo),
            alterado_por: adminId
        });

        return condominio;
    } catch (error) {
        console.error('Erro ao atualizar condomínio', error);
        throw error;
    }
}

static async atribuirSindico(adminId, id, { sindico_id }) {
    try {
        const condominio = await Condominio.findByPk(id);
        if (!condominio) throw new Error('Condomínio não encontrado.');

        if (condominio.sindico_id) throw new Error('Esse condomínio já possui um síndico.');

        const condominioDoSindico = await Condominio.findOne({
            where: { sindico_id }
        });
        if (condominioDoSindico) throw new Error('Este síndico já administra um condomínio.');

        const valorAntigo = { sindico_id: condominio.sindico_id };

        await condominio.update({ sindico_id });

        const valorNovo = { sindico_id };

        await AuditLogService.criarLog({
            user_id: id,
            acao: 'update',
            campo: 'condominio_sindico',
            valor_antigo: JSON.stringify(valorAntigo),
            valor_novo: JSON.stringify(valorNovo),
            alterado_por: adminId
        });

        return condominio;
    } catch (error) {
        console.error('Erro ao atribuir síndico:', error);
        throw error;
    }
}

static async inativarCondominio(adminId, id) {
    try {
        const condominio = await Condominio.findByPk(id);
        if (!condominio) throw new Error('Condomínio não encontrado.');

        const valorAntigo = { status: condominio.status };

        await condominio.update({ status: 'inativo' });

        const valorNovo = { status: 'inativo' };

        await AuditLogService.criarLog({
            user_id: id,
            acao: 'update',
            campo: 'condominio_status',
            valor_antigo: JSON.stringify(valorAntigo),
            valor_novo: JSON.stringify(valorNovo),
            alterado_por: adminId
        });

        return { message: 'Condomínio inativado com sucesso!' };
    } catch (error) {
        console.error('Erro ao inativar condomínio', error);
        throw error;
    }
}

static async ativarCondominio(adminId, id) {
    try {
        const condominio = await Condominio.findByPk(id);
        if (!condominio) throw new Error('Condomínio não encontrado.');

        const valorAntigo = { status: condominio.status };

        await condominio.update({ status: 'ativo' });

        const valorNovo = { status: 'ativo' };

        await AuditLogService.criarLog({
            user_id: id,
            acao: 'update',
            campo: 'condominio_status',
            valor_antigo: JSON.stringify(valorAntigo),
            valor_novo: JSON.stringify(valorNovo),
            alterado_por: adminId
        });

        return { message: 'Condomínio ativado com sucesso!' };
    } catch (error) {
        console.error('Erro ao ativar condomínio', error);
        throw error;
    }
}

    static async countApartamentosPorCondominio() {
        try {
            const condominio = await Condominio.findByPk(id);

            if (!condominio) {
                throw new Error('Condomínio não encontrado');
            }

            const total = await Apartamento.count({
                where: { condominio_id: id }
            });

            return {
                condominio_id: id,
                nome: condominio.nome,
                total_apartamentos: total
            };
        } catch (error) {
            console.error('Erro ao listar contagem de apartamentos.', error);
            throw error;
        }
    }
}