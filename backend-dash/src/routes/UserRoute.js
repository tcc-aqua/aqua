import UserController from "../controllers/UserController.js";
import User from "../models/User.js";

export default async function userRoutes(app) {
    app.get("/users", UserController.getAll);
    app.post("/users", UserController.create);
    app.get('/users/:id', UserController.getUserByid)
    app.put("/users/:id", UserController.update);
    app.delete("/users/:id", UserController.delete);
}