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

        let imageName = crypto.randomUUID()
        
        let res = await pool.query(
            `INSERT INTO services (title, description, price, image)
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [body.title, body.description, body.price, imageName])
            
        await upload.image(imageName, body.image, 'service')

        return {success: true, message: 'Услуга успешно добавлена', status: 200, data: res.rows[0]}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.updateServices = async (id, body, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)

        if(!access.success) return access

        if(body.file !== 'false') {
            upload.deleteImage(body.image, 'service')
            body.image = crypto.randomUUID()
            await upload.image(body.image, body.file, 'service')
        }

        let res = await pool.query(
            `UPDATE services SET 
            title = $1, 
            description = $2, 
            price = $3, 
            image = $4
            WHERE servicesid = $5 
            RETURNING *`,
            [body.title, body.description, body.price, body.image, id])

        return {success: true, data: res.rows[0], message: 'Услуга обновлена'}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.deleteServices = async (id, headers, ip) => {

    try {

        let access = jwt.checkTokenAdmin(headers, ip)

        if(!access.success) return access

        let service = await pool.query(`SELECT * FROM services WHERE servicesid = $1`, [id])
        service = service.rows[0]

        if(service) {
            upload.deleteImage(service.image, 'service')
            
            await pool.query(`DELETE FROM services WHERE servicesid = $1`, [id])

            return {success: true, status: 200, message: 'Услуга успещно удалена'}
        }

        return {success: true, status: 400, message: 'Ошибка'}
        
    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }

}

export default Views;