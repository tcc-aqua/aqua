import Notifications from "../models/Notifications.js";
import { NotificationAdmin } from "../models/NotificationAdmin.js";
import User from "../models/User.js";
import fastify from "../server.js";

export default class NotificationService {

  static async create({ sender_id, type, title, message }) {
    const notification = await Notifications.create({
      user_id: sender_id,
      type,
      title,
      message
    });
    const admins = await User.findAll({ where: { role: 'admin' } });
    for (const admin of admins) {
      await NotificationAdmin.create({
        notification_id: notification.id,
        admin_id: admin.id
      });

      fastify.io.to(admin.id).emit("notification", {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        criado_em: notification.criado_em
      });
    }

    return notification;
  }

  static async listByAdmin(admin_id) {
    const notifications = await NotificationAdmin.findAll({
      where: { admin_id, is_deleted: false },
      include: [{ model: Notifications, as: "notification" }],
      order: [["id", "DESC"]]
    });

    return notifications.map(n => ({
      id: n.notification_id,
      title: n.notification.title,
      message: n.notification.message,
      type: n.notification.type,
      is_read: n.is_read,
      criado_em: n.notification.criado_em
    }));
  }
  
  static async markAsRead(admin_id, notification_id) {
    await NotificationAdmin.update(
      { is_read: true },
      { where: { admin_id, notification_id } }
    );
  }

  static async deleteForAdmin(admin_id, notification_id) {
    await NotificationAdmin.update(
      { is_deleted: true },
      { where: { admin_id, notification_id } }
    );
  }

}
