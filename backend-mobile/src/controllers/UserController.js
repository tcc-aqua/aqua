import UserService from "../services/UserService.js";
import { registerUserSchema, loginUserSchema } from "../validations/userSchema.js";

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

      const result = await UserService.login(data);
      return reply.code(200).send(result);
    } catch (error) {
      console.error("Erro no login:", error);

      if (error?.issues) {
        return reply.code(400).send({ errors: error.issues });
      }

      return reply.code(400).send({ error: error.message });
    }
  }

  static async me(request, reply) {
    return reply.send({ user: request.user });
  }
}
