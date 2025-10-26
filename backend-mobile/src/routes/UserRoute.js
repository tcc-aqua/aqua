import UserController from "../controllers/UserController.js";

export default async function userRoutes(app) {
    app.get("/", UserController.getAll);
    app.post("/", UserController.create);
    app.get('/:id', UserController.getUserByid)
    app.put("/:id", UserController.update);
    app.delete("/:id", UserController.delete);
}