import pool from "../db";
import jwt from "../jwt";
import upload from "../upload";
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

        await upload.image(main_image, body.main_image)

        if (body.images && body.images.length > 0) {
            const imageUploadPromises = body.images.map(async (el) => {
                const imageName = crypto.randomUUID()
                images_list.push(imageName);
                upload.image(imageName, el, 'products');
            });

            await Promise.all(imageUploadPromises);
        }

        if(body.specifications && body.specifications.length > 0) {
            // {
            //     description: '',
            //     imageName: '',
            //     file: ''
            // }
            const imageSpecificationUpload = body.specifications.map(async (el) => {
                let load = upload.image(el.imageName, el.file, 'products')
                if(load.success) {
                    delete el.file
                }
            })

            await Promise.all(imageSpecificationUpload)
        }

        let res = await pool.query(
            `INSERT INTO products (title, description, price, discount, main_image, images, available, new, memory, specifications) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, 
            [body.title, body.description, body.price, body.discount, main_image, images_list, body.available, body.new, body.memory, JSON.stringify(body.specifications)])

        return {success: true, status: 200, data: res.rows[0]}

    } catch(e) {
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

        if (body.imagesFiles && body.imagesFiles.length > 0) {

            body.images.map((el) => {
                upload.deleteImage(el, 'products')
            })

            body.images = []

            const imageUploadPromises = body.imagesFiles.map(async (el) => {
                const imageName = crypto.randomUUID()
                body.images.push(imageName);
                await upload.image(imageName, el, 'products');
            });

            await Promise.all(imageUploadPromises);
        }

        let req = await pool.query(`
            UPDATE products SET
            title = $1,
            description = $2,
            price = $3,
            discount = $4,
            main_image = $5,
            images = $6,
            available = $7,
            new = $8,
            memory = $9,
            specifications = $10
            WHERE productid = $11
            RETURNING *`, 
            [body.title, body.description, body.price, 
            body.discount, body.main_image, body.images, 
            body.available, body.new, body.memory, body.specifications, id])

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