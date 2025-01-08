import pool from "../db";
import jwt from "../jwt";
import upload from "../upload";

const Views = {}

Views.getAllProducts = async (query) => {
    try {

        /*Сортировка*/
        let order = query.order || 'datetime'
        let sort = query.sort || 'DESC'

        /*Отправка всех товаров*/
        let res = await pool.query(`
            SELECT 
                products.productid,
                products.title,
                products.price,
                products.main_image,
                products.datetime,
                products.memory,
                products.color,
                products.colorName,
                products.article,
                COALESCE(
                    json_agg(
                        jsonb_build_object(
                            'id', specifications.specificationsid,
                            'description', specifications.description,
                            'icon', specifications.icon
                        )
                        ORDER BY specifications.description 
                    ) FILTER (WHERE specifications.article IS NOT NULL), 
                    '[]'
                ) AS specifications
            FROM products
            LEFT OUTER JOIN specifications 
            ON products.article = specifications.article 
            GROUP BY 
                products.productid,
                products.title,
                products.price,
                products.main_image,
                products.datetime,
                products.memory,
                products.color,
                products.colorName,
                products.article
            ORDER BY ${order} ${sort}
        `);

        return {success: true, status: 200, data: res.rows}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.createProduct = async (body, headers, ip) => {
    try {
        
        /*Проверка токена*/
        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access
        
        /*Создание изображения товара*/
        let main_image = crypto.randomUUID()
        await upload.image(main_image, body.main_image, 'products')

        /*Создание товара*/
        let res = await pool.query(
            `INSERT INTO products (title, price, main_image, memory, article, color, colorName)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, 
            [body.title, body.price, main_image, body.memory, body.article, body.color, body.colorName])

        return {success: true, status: 200, data: res.rows[0], message: 'Товар успешно создан'}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.createSpecification = async (body, headers, ip) => {
    try {

        /*Проверка токена*/
        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        /*Создание изображения хар-ки*/
        let imageName = crypto.randomUUID()
        await upload.image(imageName, body.file, 'products')

        /*Создание хар-ки*/
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

Views.updateSpecification = async (body, headers, ip, id) => {
    try {

        /*Проверка токена*/
        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        /*Обновление изображения*/
        if(body.file !== 'false') {
            upload.deleteImage(body.icon, 'products')
            body.icon = crypto.randomUUID()
            await upload.image(body.icon, body.file, 'products')
        }

        /*Обновление хар-ки*/
        let res = await pool.query(`
            UPDATE specifications SET
            icon = $1,
            description = $2
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

        /*Проверка токена*/
        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        /*Обновление изображения*/
        if(body.mainFile !== 'false') {
            upload.deleteImage(body.main_image, 'products')
            body.main_image = crypto.randomUUID()
            await upload.image(body.main_image, body.mainFile, 'products')
            console.log('dsd')
        }

        /*Обновление товара*/
        let req = await pool.query(`
            UPDATE products SET
            title = $1,
            price = $2,
            main_image = $3,
            memory = $4,
            color = $5,
            colorName = $6
            WHERE productid = $7
            RETURNING *`, 
            [body.title, body.price, body.main_image, body.memory, body.color, body.colorName, id])

        return {success: true, message: 'Товар успешно обновлён', data: req.rows[0]}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.deleteProduct = async (id, headers, ip) => {
    try {

        /*Проверка токена*/
        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access
            
        /*Удаление товара*/
        let product = await pool.query(`DELETE FROM products WHERE productid = $1 RETURNING *`, [id])
        product = product.rows[0]
        upload.deleteImage(product.main_image, 'products')

        /*Удаление хар-к*/
        let specifications = await pool.query(`DELETE FROM specifications WHERE article = $1 RETURNING *`, [product.article])
        if(specifications.rows?.length > 0) {
            specifications.rows.map((el) => {
                upload.deleteImage(el.icon, 'products')
            })
        }

        return {success: true, status: 200, message: 'Товар успешно удалён', data: product}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

Views.deleteSpecification = async (id, headers, ip) => {
    try {

        /*Проверка токена*/
        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        /*Удаление хар-ки*/
        let req = await pool.query(`DELETE FROM specifications WHERE specificationsid = $1 RETURNING *`, [id])
        let data = req.rows[0]
        upload.deleteImage(data.icon, 'products')

        return {success: true, message: 'Характеристика удалена', status: 200, data}

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }
}

export default Views;