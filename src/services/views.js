import pool from "../db";
import jwt from "../jwt";
import utils from "../utils";

const Views = {}

Views.getAllSetvices = async () => {
    try {

        let res = await pool.query(`SELECT * FROM services`)

        return {success: true, status: 200, data: res.rows}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.createServices = async (body, headers, ip) => {
    try {

        let token = utils.getToken(headers)

        if(token.ip !== ip) {
            return  {success: false, status: 401, message: 'Токен не действителен'}
        }

        if(token.role !== 'admin') {
            return {success: false, message: 'Недостаточно прав', status: 401}
        }

        let slug = await utils.slug(body.title, 'services')
        if(!slug.success) {
            return {success: false, status: 400, message: "Не удалось сохранить slug"}
        }

        await upload.image(slug.str, body.image)

        let res = await pool.query(
            `INSERT INTO services (image, title, description, price, slug)
            VALUES ($1, $2, $3, $4, $5 ) RETURNING *`,
            [slug,str, body.title, body.description, body.price, slug.str])

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.deleteServices = async (id, headers, ip) => {
    try {

        let token = utils.getToken(headers)

        if(token.ip !== ip) {
            return  {success: false, status: 401, message: 'Токен не действителен'}
        }

        if(token.role !== 'admin') {
            return {success: false, message: 'Недостаточно прав', status: 401}
        }

        let res = await pool.query(`SELECT * FROM services WHERE servicesid = $1`, [id])

        res = res.rows[0]

        if(!res) {
            return {success: false, message: 'Не удалось удалить услугу', status: 400}
        }

        await pool.query(`DELETE FROM services WHERE servicesid = $1`, [id])

        return {success: true, status: 200}
        
    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }

}

export default Views;