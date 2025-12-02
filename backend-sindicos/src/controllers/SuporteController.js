import EnviarMensagemUsuarioService from '../services/suporte/addMensagem.js';
import GetMensagensSuporteService from '../services/suporte/getAllMensagens.js';
import SuporteService from '../services/suporte/getCards.js';

export default class SuporteController {

    static async countMensagensRecebidas(request, reply) {
        const userId = request.user.id;
        const total = await SuporteService.getMensagensRecebidasCount(userId);
        return reply.status(200).send({ total });
    }
    static async countMensagensEnviadas(request, reply) {
        const userId = request.user.id;
        const total = await SuporteService.getMensagensEnviadasCount(userId);
        return reply.status(200).send({ total });
    }

    static async countTotalInteracoes(request, reply) {
        const userId = request.user.id;
        const total = await SuporteService.getTotalInteracoesCount(userId);
        return reply.status(200).send({ total });
    }

    static async countMensagensAdministrativo(request, reply) {
        const total = await SuporteService.getMensagensAdministrativoCount();
        return reply.status(200).send({ total });
    }

    static async enviarMensagemUsuario(request, reply) {
        const remetente_id = request.user.id;
        const { assunto, mensagem, destinatario_id } = request.body;

        if (!assunto || !mensagem || !destinatario_id) {
            return reply.status(400).send({
                message: "Campos obrigatórios ausentes: 'assunto', 'mensagem' e 'destinatario_id' são necessários."
            });
        }

        const dadosMensagem = {
            assunto,
            mensagem,
            remetente_id, // Usado pelo Service para encontrar o condomínio
            destinatario_id,
        };

        try {
            const novaMensagem = await EnviarMensagemUsuarioService.enviar(dadosMensagem);

            return reply.status(201).send({
                message: "Mensagem enviada com sucesso para o usuário.",
                data: novaMensagem
            });

        } catch (error) {
            console.error("Erro no Controller ao enviar mensagem para usuário:", error);
            const statusCode = error.message.includes('não pertence') ? 403 : 400;

            return reply.status(statusCode).send({
                message: error.message || "Falha interna ao enviar a mensagem."
            });
        }
    }

    static async getAllMensagens(request, reply) {
        const sindico_id = request.user.id;
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 10;
        const mensagensPaginadas = await GetMensagensSuporteService.getAllMensagens(
            sindico_id,
            page,
            limit
        );

        return reply.status(200).send(mensagensPaginadas);
    }
}