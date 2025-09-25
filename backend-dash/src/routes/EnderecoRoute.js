import EnderecoController from "../controllers/EnderecoController.js";

export default async function enderecoRoutes(app){
    app.get('/enderecos', EnderecoController.getAll);
    app.post('/enderecos', EnderecoController.create);
    app.get('/enderecos/:id', EnderecoController.getById);
    app.put('/enderecos/:id', EnderecoController.update);
    app.delete('/enderecos/:id', EnderecoController.delete);
}