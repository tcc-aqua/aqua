import PasswordService from "../services/PasswordService.js";

export default class PasswordController {

    static async forgotPassword(req, reply){
        const {email} = req.body;
        const result = await PasswordService.sendResetEmail(email);
        return reply.status(200).send(result);
    }

    static async resetPassword(req, reply){
        const  {token, newPassword} = req.body;
        const result = await PasswordService.resetPassword(token, newPassword);
        return reply.status(200).send(result);
    }

}