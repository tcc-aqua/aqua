import axios from 'axios';

export default class CepService {
  static async buscarCep(cep) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      // Se a resposta contém a propriedade "erro", significa que o CEP é inválido.
      // Em vez de lançar um erro, retornamos null para indicar "não encontrado".
      if (response.data.erro) {
        console.log(`CEP Service: CEP ${cep} não encontrado no ViaCEP.`);
        return null;
      }

      // Se encontrou, retorna o objeto de endereço formatado.
      return {
        cep: response.data.cep,
        logradouro: response.data.logradouro,
        bairro: response.data.bairro,
        localidade: response.data.localidade, // Mantive localidade para consistência com o que você já usa
        uf: response.data.uf,
        estado: '' // A API ViaCEP não retorna o nome do estado, apenas a sigla.
      };
    } catch (error) {
      // Se ocorrer um erro de rede ou qualquer outra falha na consulta,
      // logamos o erro e retornamos null.
      console.error(`Erro ao consultar a API do ViaCEP para o CEP ${cep}:`, error.message);
      return null;
    }
  }
}