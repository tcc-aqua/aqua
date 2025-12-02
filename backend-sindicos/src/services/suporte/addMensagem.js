import Suporte from "../../models/Suporte.js"; 
import User from "../../models/User.js";
import Condominio from "../../models/Condominio.js";
import Apartamento from "../../models/Apartamento.js"; 

export default class EnviarMensagemUsuarioService {
    static async enviar(dadosMensagem) {
        const { destinatario_id, remetente_id } = dadosMensagem;

        if (!destinatario_id) {
            throw new Error("O ID do destinatário é obrigatório para o envio direto a um usuário.");
        }
        if (destinatario_id === remetente_id) {
            throw new Error("Não é permitido enviar mensagem para si mesmo.");
        }

        try {
            const condominioRemetente = await Condominio.findOne({
                where: { sindico_id: remetente_id },
                attributes: ['id']
            });

            if (!condominioRemetente) {
                throw new Error("O remetente não está associado a um condomínio ou não é um síndico válido.");
            }
            const condominio_id = condominioRemetente.id;

            const destinatario = await User.findOne({
                where: { 
                    id: destinatario_id,
                    status: 'ativo',
                    type: 'condominio' 
                },
                include: [
                    {
                        model: Apartamento,
                        as: 'apartamento',
                        required: true, 
                        where: {
                            condominio_id: condominio_id
                        }
                    }
                ]
            });

            if (!destinatario) {
                throw new Error("O destinatário não pertence ao seu condomínio ou não é um morador de apartamento ativo.");
            }
            
            const dadosParaCriar = {
                ...dadosMensagem,
                condominio_id: condominio_id, 
                tipo_destino: 'usuario', 
            };

            const novaMensagem = await Suporte.create(dadosParaCriar);
            return novaMensagem;
            
        } catch (error) {
            console.error("Erro no Service ao enviar mensagem para usuário:", error);
            throw new Error(error.message || "Falha ao enviar a mensagem de suporte.");
        }
    }
}