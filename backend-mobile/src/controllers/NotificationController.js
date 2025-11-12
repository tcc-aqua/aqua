import NotificationService from "../services/NotificationService.js";

export default class NotificationController {
    static async create(req, reply) {
        const { sender_id, type, title, message } = req.body;
        const notification = await NotificationService.create({ sender_id, type, title, message });
        return reply.send(notification);
    }
}
