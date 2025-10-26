import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authMiddleware(request, reply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) return reply.code(401).send({ error: "Token não fornecido" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) return reply.code(401).send({ error: "Usuário não encontrado" });

    request.user = user;
  } catch (error) {
    return reply.code(401).send({ error: "Token inválido" });
  }
}
