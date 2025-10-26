import EnderecoController from "../controllers/EnderecoController.js";

export default async function enderecoRoutes(app){
    app.get('/', EnderecoController.getAll);
    app.post('/', EnderecoController.create);
    app.get('/:id', EnderecoController.getById);
    app.put('/:id', EnderecoController.update);
    app.delete('/:id', EnderecoController.delete);
}