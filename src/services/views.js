import pool from "../db";
import jwt from "../jwt";
import upload from "../upload";
import utils from "../utils";

const Views = {}

Views.getAllServices = async () => {
    try {

        let res = await pool.query(`SELECT * FROM services`)

        return {success: true, status: 200, data: res.rows}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.createServices = async (body, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)

        if(!access.success) return access
        
        let res = await pool.query(
            `INSERT INTO services (title, description, price)
            VALUES ($1, $2, $3) RETURNING *`,
            [body.title, body.description, body.price])

        res = res.rows[0]

        await pool.query(`UPDATE services SET image = $1 WHERE servicesid = $2`,
            [res.servicesid, res.servicesid])
            
        await upload.image(res.servicesid, body.image, 'services')

        return {success: true, message: 'Услуга успешно добавлена', status: 200}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.updateServices = async (id, body, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)

        if(!access.success) return access

        if(body.image) {
            upload.deleteImage(id, 'services')
            await upload.image(id, body.image, 'services')
        }

        let res = await pool.query(
            `UPDATE services SET 
            title = $1, 
            description = $2, 
            price = $3, 
            WHERE servicesid = $4 
            RETURNING *`,
            [body.title, body.description, body.price, id])

        return {success: true}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.deleteServices = async (id, headers, ip) => {

    try {

        let access = jwt.checkTokenAdmin(headers, ip)

        if(!access.success) return access

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