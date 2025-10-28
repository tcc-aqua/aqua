import axios from "axios";

export default class DicaService {
    static async gerarDicaDoDia() {
        const apiKey = process.env.GEMINI_API_KEY;

        const prompt = `
         Gere uma dica curta (até 200 caracteres) sobre consumo consciente e economia de recursos,
         especialmente água e energia. Use uma linguagem simples, inspiradora e prática.
         Exemplo: "Desligue o chuveiro enquanto se ensaboa — economiza até 30 litros por banho!"
         `;

        try {
            const response = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
                { contents: [{ parts: [{ text: prompt }] }] },
                {
                    headers: { "Content-Type": "application/json" },
                    params: { key: apiKey },
                }
            );

            const dica =
                response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Economize energia desligando luzes desnecessárias.";

            return dica.trim();
        } catch (error) {
            console.error("Erro na chamada da API Gemini:", error.message);
            return "Erro ao gerar a dica do dia. Lembre-se: pequenas ações geram grandes economias!";
        }
    }
}