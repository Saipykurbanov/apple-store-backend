import pool from "../db";
import jwt from "../jwt";

const Views = {}

Views.getAllOrders = async () => {
    try {

        let newOrders = await pool.query(`SELECT * FROM orders WHERE status = $1`, ['new'])
        let oldOrders = await pool.query(`SELECT * FROM orders WHERE status = $1`, ['old'])

        return {success: true, status: 200, data: {newOrders: newOrders.rows, oldOrders: oldOrders.rows}}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.createOrder = async (body) => {
    try {   

        let req = await pool.query(`
            INSERT INTO orders 
            (username, phone, address, poductid, title, image, memory, price)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [body.username, body.phone, body.address, body.productid, body.title, body.image, body.memory, body.price])

        return {success: true, data: req.rows[0], message: 'Заказ успешно создан', status: 200}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.updateOrder = async (ip, headers, id, body) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        
        if(!access.success) return access

        let req = await pool.query(`
            UPDATE orders SET
            username = $1,
            phone = $2,
            address = $3,
            productid = $4,
            title = $5,
            image = $6,
            memory = $7,
            price = $8
            WHERE ordersid = $9
            RETURNING *`,
            [body.username, body.phone, body.address, body.productid, body.title, body.image, body.memory, body.price, id])

        return {success: true, message: 'Заказ обновлен', data: req.rows[0], status: 200}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
} 

Views.deleteOrder = async (id, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        
        if(!access.success) return access

        let req = await pool.query(`DELETE FROM orders WHERE orders = $1`, [id])

        return {success: true, status: 200, message: 'Заказ удалён', data: req.rows[0]}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

export default Views;