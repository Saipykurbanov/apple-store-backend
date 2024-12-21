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
            
        await upload.image(imageName, body.image, 'services')

        return {success: true, message: 'Услуга успешно добавлена', status: 200, data: res.rows[0]}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.updateServices = async (id, body, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)

        if(!access.success) return access

        let imageName = body.image

        if(body.file) {
            imageName = crypto.randomUUID()
            upload.deleteImage(body.image, 'services')
            await upload.image(imageName, body.file, 'services')
        }

        let res = await pool.query(
            `UPDATE services SET 
            title = $1, 
            description = $2, 
            price = $3, 
            image = $4,
            WHERE servicesid = $5 
            RETURNING *`,
            [body.title, body.description, body.price, imageName, id])

        return {success: true, data: res.rows[0]}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.deleteServices = async (id, headers, ip) => {

    try {

        let access = jwt.checkTokenAdmin(headers, ip)

        if(!access.success) return access

        await pool.query(`DELETE FROM services WHERE servicesid = $1`, [id])

        return {success: true, status: 200, message: 'Услуга успещно удалена'}
        
    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }

}

export default Views;