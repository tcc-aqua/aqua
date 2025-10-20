import sequelize from "../config/sequelize.js";
import { Model } from "sequelize";
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcryptjs'

export default class User extends Model {}

User.init({
    id: {

    }
})