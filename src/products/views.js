import pool from "../db";
import jwt from "../jwt";
import upload from "../upload";

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
        
        let main_image = crypto.randomUUID()

        await upload.image(main_image, body.main_image)

        body.specifications = JSON.parse(body.specifications)

        if(body.specifications && body.specifications.length > 0) {
            const imageSpecificationUpload = body.specifications.map(async (el) => {
                let load = upload.image(el.imageName, el.file, 'products')
                if(load.success) {
                    delete el.file
                }
            })

            await Promise.all(imageSpecificationUpload)
        }

        let res = await pool.query(
            `INSERT INTO products (title, price, main_image, memory, specifications, color, colorName) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, 
            [body.title, body.price, main_image, body.memory, JSON.stringify(body.specifications), body.color, body.colorName])

        return {success: true, status: 200, data: res.rows[0], message: 'Товар успешно создан'}

    } catch(e) {
        console.log(e)
        return {success: false, status: 500, message: e.message}
    }

}

Views.updateProduct = async (body, headers, ip, id) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        
        if(!access.success) return access

        if(body.mainFile) {
            upload.deleteImage(body.main_image, 'products')
            body.main_image = crypto.randomUUID()
            await upload.image(body.main_image, body.mainFile, 'products')
        }

        let req = await pool.query(`
            UPDATE products SET
            title = $1,
            price = $2,
            main_image = $3,
            memory = $4,
            specifications = $5,
            color = $6,
            colorName = $7
            WHERE productid = $8
            RETURNING *`, 
            [body.title, body.price, body.main_image, body.memory, body.specifications, body.color, body.colorName, id])

        return {success: true, message: 'Товар успешно обновлён', data: req.rows[0]}


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