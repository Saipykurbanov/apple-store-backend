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
        
        let token = utils.getToken(headers)

        if(token.ip !== ip) {
            return  {success: false, status: 401, message: 'Токен не действителен'}
        }

        if(token.role !== 'admin') {
            return {success: false, message: 'Недостаточно прав', status: 401}
        }
        
        let images_list = []
        let slug = await utils.slug(body.title, 'products')
        if(!slug.success) {
            return {success: false, status: 400, message: "Не удалось сохранить slug"}
        }

        await upload.image(slug.str, body.main_image)
        if (body.images && body.images.length > 0) {
            const imageUploadPromises = body.images.map(async (el, i) => {
                const imageName = `${slug.str}${i}`;
                images_list.push(imageName);
                upload.image(imageName, el);
            });

            await Promise.all(imageUploadPromises);
        }

        let res = await pool.query(
            `INSERT INTO products (title, description, price, discount, main_image, images, available, new, slug) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, 
            [body.title, body.description, body.price, body.discount, slug.str, images_list, body.available, body.new, slud.str])

        return {success: true, status: 200, data: res.rows[0]}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }

}

export default Views;