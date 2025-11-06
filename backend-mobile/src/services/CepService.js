import axios from 'axios';

export default class CepService {
  static async buscarCep(cep) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }

      return {
        logradouro: response.data.logradouro,
        bairro: response.data.bairro,
        cidade: response.data.localidade,
        uf: response.data.uf,
        cep: response.data.cep
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error.message);
      throw new Error('Não foi possível consultar o CEP');
    }
  }
}
