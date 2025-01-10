import pool from "../db.js";
import jwt from "../jwt.js";

const Views = {}

Views.getDollar = async () => {
    try {

        let res = await pool.query(`SELECT * FROM course WHERE currency = $1`, ['USD'])

        return {success: true, status: 200, data: res.rows[0]}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.createCourse = async (ip, headers, body) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
                
        if(!access.success) return access

        let res = await pool.query(`INSERT INTO course (currency, value) VALUES ($1, $2) RETURNING *`, [body.currency, body.value])

        return {success: true, status: 200, data: res.rows[0], message: 'Курс успешно создан'}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.updateCourse = async (ip, headers, id, body) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
                
        if(!access.success) return access

        let req = await pool.query(`UPDATE course SET value = $1 WHERE courseid = $2 RETURNING *`, [body.value, id])

        return {success: true, status: 200, data: req.rows[0], message: 'Курс успешно обновлён'}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.deleteCourse = async (ip, headers, id) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
                
        if(!access.success) return access

        await pool.query(`DELETE FROM course WHERE courseid = $1`, [id])

        return {success: true, status: 200, message: 'Курс удалён'}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

export default Views;