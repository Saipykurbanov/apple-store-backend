import pool from "../db";
import jwt from "../jwt";
import utils from "../utils";


const Views = {}

Views.init = async (headers, ip) => {
    try {

        let user = utils.getToken(headers)
        
        if(user.ip !== ip) {
            return {success: false, status: 401, message: 'Токен не действителен'}
        }

        let res = await pool.query(`SELECT * FROM users WHERE userid = \$1`, [user.user_id])

        res = res.rows[0]

        if(!res) {
            return {success: false, status: 401}
        }

        return {success: true, status: 200, data: res}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.signIn = async (user, ip) => {
    try {

        let res = await pool.query(`SELECT * FROM users WHERE email = \$1`, [user.email])
        res = res.rows[0]

        if(!res) {
            return {success: false, status: 400, message: 'Неверный логин или пароль'}
        }

        let password = new Bun.CryptoHasher("sha256").update(user.password).digest("hex")
        if(res.password !== password) {
            return {success: false, status: 400, message: 'Неверный логин или пароль'}
        }

        const accessToken = jwt.create(res, ip)

        return {success: true, accessToken: accessToken, status: 200}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

export default Views;