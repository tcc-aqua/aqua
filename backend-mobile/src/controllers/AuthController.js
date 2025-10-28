import UserService from "../services/AuthService.js";
import { registerUserSchema, loginUserSchema } from "../dtos/auth/authDTO.js";
import jwt from 'jsonwebtoken'

export default class UserController {

  static async register(request, reply) {
    try {
      const data = registerUserSchema.parse(request.body);

      const result = await UserService.register(data);
      return reply.code(201).send(result);
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);

      if (error?.issues) {
        return reply.code(400).send({ errors: error.issues });
      }

      return reply.code(400).send({ error: error.message });
    }
  }

  static async login(request, reply) {
    try {
      const data = loginUserSchema.parse(request.body);

      const user = await UserService.login(data);

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          type: user.type,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return reply.code(200).send({
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          type: user.type,
        },
        token,
      });
    } catch (error) {
      console.error("Erro no login:", error);

      if (error?.issues) {
        return reply.code(400).send({ errors: error.issues });
      }

      return reply.code(400).send({ error: error.message });
    }
  }

  static async me(req, reply) {
    const userId = req.user.id; // obtido do authMiddleware
    const user = await UserService.getMe(userId);
    return reply.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      role: user.role,
      status: user.status
    });
  }
}
