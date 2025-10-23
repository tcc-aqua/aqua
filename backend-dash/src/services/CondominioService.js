import Condominio from "../models/Condominio.js";
export default class CondominioService {

    static async getAllCondominios(page = 1, limit = 10) {
        try {
            const options = {
                page,
                paginate: limit,
                order: [['criado_em', 'DESC']],
            }
            const condomonios = await Condominio.paginate(options);
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
                order: [['criado_em', 'DESC']],
                where: { status: 'ativo' },
            }
            const condominios = await Condominio.paginate(options);
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
                order: [['criado_em', 'DESC']],
                where: { status: 'inativo' },
            }
            const condominios = await Condominio.paginate(options);
            return condominios;

        } catch (error) {
            console.error('Erro ao buscar condominios inativos', error);
            throw error;
        }
    }

    static async getAllUnidadesAtivasDeUmCondominio(id, page = 1, limit = 10) {
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

            const unidades = await Condominio.paginate(options);
            return unidades;
        } catch (error) {
            console.error('Erro ao listar unidades ativas do condominio')
        }
    }
    static async getAllUnidadesAtivasDeUmCondominio(id, page = 1, limit = 10) {
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

            const unidades = await Condominio.paginate(options);
            return unidades;
        } catch (error) {
            console.error('Erro ao listar unidades ativas do condominio')
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

    static async createCondominio({ name, endereco, sindico_id }) {
        try {
            const condominio = await Condominio({
                name, endereco, sindico_id
            })
            return condominio;
        } catch (error) {
            console.error('Erro ao criar condominio', error);
            throw error;
        }
    }

    static async updateCondominio(id, { name, endereco, sindico_id }) {
        try {
            const condominio = await Condominio.findByPk(id);
            if (!condominio) {
                throw new Error('Condominio não encontrado.')
            }

            await condominio.update({
                name, endereco, sindico_id
            })

            return condominio;
        } catch (error) {
            console.error('Erro ao atualizar condominio', error);
            throw error;
        }
    }

    static async inativarCondominio(id) {
        try {
            const condominio = await findByPk(id);
            if (!condominio) {
                throw new Error('Condominio não encontrado');
            }

            await condominio.update({ status: 'inativo' });
            return { message: 'Condominio inativado com sucesso!' }
        } catch (error) {
            console.error('Erro ao inativar condominio');
            throw error;
        }
    }

    static async ativarCondominio(id) {
        try {
            const condominio = await findByPk(id);
            if (!condominio) {
                throw new Error('Condominio não encontrado');
            }

            await condominio.update({ status: 'ativo' });
            return { message: 'Condominio ativado com sucesso!' }
        } catch (error) {
            console.error('Erro ao ativar condominio');
            throw error;
        }
    }
}