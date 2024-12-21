import pool from "../db";
import jwt from "../jwt";
import utils from "../utils";

const Views = {}

Views.getAllProducts = async (query) => {
    try {
        let order = query.order || 'datetime'
        let sort = query.sort || 'DESC'

        let res = await pool.query(`
            SELECET * 
            FROM products
            ORDER BY ${order} ${sort}
        `)

        return {success: true, status: 200, data: res.rows}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.createProduct = async (body, headers, ip) => {
    try {
        
        let access = jwt.checkTokenAdmin(headers, ip)
        
        if(!access.success) return access
        
        let images_list = []
        let main_image = crypto.randomUUID()

        await upload.image(slug.str, body.main_image)

        if (body.images && body.images.length > 0) {
            const imageUploadPromises = body.images.map(async (el) => {
                const imageName = crypto.randomUUID()
                images_list.push(imageName);
                upload.image(imageName, el, 'products');
            });

            await Promise.all(imageUploadPromises);
        }

        let res = await pool.query(
            `INSERT INTO products (title, description, price, discount, main_image, images, available, new) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, 
            [body.title, body.description, body.price, body.discount, main_image, images_list, body.available, body.new])

        return {success: true, status: 200, data: res.rows[0]}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }

}

Views.updateProduct = async (body, headers, ip, id) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        
        if(!access.success) return access



    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.deleteProduct = async (id, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        
        if(!access.success) return access

        await pool.query(`DELETE FROM products WHERE productid = $1`, [id])

        return {success: true, status: 200, message: 'Товар успешно удалён'}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

export default Views;