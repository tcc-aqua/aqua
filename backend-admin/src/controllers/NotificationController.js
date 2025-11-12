import NotificationService from "../services/NotificationService.js";

export default class NotificationController {
  static async create(req, reply) {
    const { sender_id, type, title, message } = req.body;
    const notification = await NotificationService.create({ sender_id, type, title, message });
    return reply.send(notification);
  }

  static async list(req, reply) {
    const admin_id = req.user.id; 
    const notifications = await NotificationService.listByAdmin(admin_id);
    return reply.send(notifications);
  }

  static async markAsRead(req, reply) {
    const admin_id = req.user.id;
    const { notification_id } = req.body;
    await NotificationService.markAsRead(admin_id, notification_id);
    return reply.send({ success: true });
  }

  static async delete(req, reply) {
    const admin_id = req.user.id;
    const { notification_id } = req.body;
    await NotificationService.deleteForAdmin(admin_id, notification_id);
    return reply.send({ success: true });
  }
}
