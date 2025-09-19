import ConsumoAguaController from "../controllers/ConsumoAguaController.js";

export default async function userRoutes(app) {
    app.get("/consumos", ConsumoAguaController.getAll);
    app.post("/consumos", ConsumoAguaController.create);
    app.get("/consumos/:id", ConsumoAguaController.getById);
}