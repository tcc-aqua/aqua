import CondominioService from "../services/CondominioService.js";
import { createCondominioDTO } from "../dto/condominio/createCondominioDTO.js";
import {updateCondominioDTO} from '../dto/condominio/updateCondominioDTO.js'
import { atribuirSindicoDTO } from "../dto/condominio/atribuirSindicoDTO.js";

export default class CondominioController {
    static async getAll(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const condominios = await CondominioService.getAllCondominios(page, limit);
        return reply.status(200).send(condominios);
    }

    static async getAllActives(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const condominios = await CondominioService.getAllActivesCondominios(page, limit);
        return reply.status(200).send(condominios);
    }

    static async getAllInativos(req, reply) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const condominios = await CondominioService.getAllDeactivetedCondominios(page, limit);
        return reply.status(200).send(condominios);
    }

    static async count(req, reply) {
        const condominiosTotais = await CondominioService.countAllCondominios();
        return reply.status(200).send(condominiosTotais);
    }

    static async create(req, reply) {
        const validateCondominio = createCondominioDTO.parse(req.body);
        const condominio = await CondominioService.createCondominio(validateCondominio)
        return reply.status(201).send(condominio);
    }

    static async update(req, reply) {
        const { id } = req.params;
        const validateCondominio = updateCondominioDTO.parse(req.body);
        const updateCondominio = await CondominioService.updateCondominio(id, validateCondominio);
        return reply.status(200).send(updateCondominio)
    }

    static async atribuirSindico(req, reply) {
        const {id} = req.params;
        const validateSindico = atribuirSindicoDTO.parse(req.body);
        const condominio = await CondominioService.atribuirSindico(id, validateSindico);
        return reply.status(200).send(condominio);
    }

    static async inativar(req, reply) {
        const { id } = req.params;
        const condominio = await CondominioService.inativarCondominio(id);
        return reply.status(200).send(condominio);
    }

    static async ativar(req, reply) {
        const { id } = req.params;
        const condominio = await CondominioService.ativarCondominio(id);
        return reply.status(200).send(condominio);
    }

    static async listarQtdApartamentos(req, reply){
        const { id } = req.params;
        const apartamentos = await CondominioService.countApartamentosPorCondominio(id);
        return reply.status(200).send(apartamentos);
    }
}