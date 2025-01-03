import pool from "../db";
import jwt from "../jwt";
import upload from "../upload";

const Views = {}

Views.getAllProducts = async (query) => {
    try {
        let order = query.order || 'datetime'
        let sort = query.sort || 'DESC'

        let res = await pool.query(`
            SELECT * 
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

        await upload.image(main_image, body.image, 'products')

        let res = await pool.query(
            `INSERT INTO products (title, price, main_image, memory, article, color, colorName)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, 
            [body.title, body.price, main_image, body.memory, body.article, body.color, body.colorName])

        return {success: true, status: 200, data: res.rows[0], message: 'Товар успешно создан'}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }

}

Views.createAllSpecifications = async (body, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        let data = []
        
        if(!access.success) return access


        if(body.data && body.data?.length > 0) {
            let create = body.data.map(async (el) => {
                let imageName = crypto.randomUUID()
                await upload.image(imageName, el.image, 'products')
        
                let res = await pool.query(`
                    INSERT INTO specifications 
                    (icon, description, article)
                    VALUES ($1, $2, $3) RETURNING *`, 
                    [imageName, el.description, body.article]
                )

                res = res.rows[0]

                if(res) {
                    data.push(res)
                }
            })

            await Promise.all(create)
        }

        return {success: true, status: 200, message: 'Характеристика добавлена', data}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.createSpecification = async (body, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        let imageName = crypto.randomUUID()
        await upload.image(imageName, body.image, 'products')

        let res = await pool.query(`
            INSERT INTO specifications 
            (icon, description, article)
            VALUES ($1, $2, $3) RETURNING *`, 
            [imageName, body.description, body.article]
        )

        return {success: true, status: 200, message: 'Характеристика добавлена', data: res.rows[0]}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.updateSpecifocation = async (body, headers, ip, id) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        if(body.image) {
            upload.deleteImage(body.icon, 'products')
            body.icon = crypto.randomUUID()
            await upload.image(body.icon, body.image, 'products')
        }

        let res = await pool.query(`
            UPDATE specifications SET
            icon $1,
            description $2
            WHERE specificationsid = $3
            RETURNING *`,
            [body.icon, body.description, id]    
        )

        return {success: true, status: 200, message: 'Характеристика обновлена', data: res.rows[0]}

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

        let req = await pool.query(`
            UPDATE products SET
            title = $1,
            price = $2,
            main_image = $3,
            memory = $4,
            article = $5,
            color = $6,
            colorName = $7
            WHERE productid = $8
            RETURNING *`, 
            [body.title, body.price, body.main_image, body.memory, body.article, body.color, body.colorName, id])

        return {success: true, message: 'Товар успешно обновлён', data: req.rows[0]}


    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.deleteProduct = async (id, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        
        if(!access.success) return access

        let product = await pool.query(`SELECT * FROM products WHERE productid = $1`, [id])
        product = product.rows[0]
        
        if(product) {
            
            upload.deleteImage(product.main_image, 'products')
            
            product.specifications.map((el) => {
                upload.deleteImage(el.imageName, 'products')
            })

            await pool.query(`DELETE FROM products WHERE productid = $1`, [id])

            return {success: true, status: 200, message: 'Товар успешно удалён'}
        }

        return {success: false, status: 400, message: 'Ошибка'}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

export default Views;