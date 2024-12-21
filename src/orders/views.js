import pool from "../db";
import jwt from "../jwt";
import upload from "../upload";
import utils from "../utils";

const Views = {}

Views.getAllOrders = async () => {
    try {

        let req = await pool.query(`SELECT * FROM orders`)

        return {success: true, status: 200, data: req.rows[0]}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.createOrder = async (body) => {
    try {   

        let req = await pool.query(`
            INSERT INTO orders 
            (username, phone, address, productid)
            VALUES ($1, $2, $3, $4)`,
        [body.username, body.phone, body.address, body.productid])

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
            productid = $4
            WHERE ordersid = $5
            RETURNING *`,
            [body.username, body.phone, body.address, body.productid, id])

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