import UserController from "../controllers/UserController.js";

export default async function userRoutes(app) {
    app.get("/users", UserController.getAll);
    app.post("/users", UserController.create);
    app.get("/users/:id", UserController.getByid);
    app.put("/users/:id", UserController.update);
    app.delete("/users/:id", UserController.delete);
}