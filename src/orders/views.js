import pool from "../db";
import jwt from "../jwt";

const Views = {}

Views.getAllOrders = async () => {
    try {

        let newOrders = await pool.query(`SELECT * FROM orders WHERE status = $1 ORDER BY datetime DESC`, ['new'])
        let oldOrders = await pool.query(`SELECT * FROM orders WHERE status = $1 LIMIT 10`, ['old'])


        return {success: true, status: 200, data: {newOrders: newOrders.rows, oldOrders: oldOrders.rows}}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.getStatistics = async () => {
    try {
        
        let newOrders = await pool.query(`SELECT * FROM orders WHERE status = $1`, ['new'])
        let oldOrders = await pool.query(`SELECT * FROM orders WHERE status = $1`, ['old'])

        let all = newOrders.rows.length + oldOrders.rows.length
        let profit = oldOrders.rows.reduce((sum, el) => sum + el.price, 0);

        return {success: true, status: 200, data: {all, current: newOrders.rows.length, sold: oldOrders.rows.length, profit}}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.createOrder = async (body) => {
    try {   
        let res = await pool.query(`
            INSERT INTO orders 
            (username, phone, address, productid, title, image, memory, price)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [body.username, body.phone, body.address, body.productid, body.title, body.image, body.memory, body.price])

        return {success: true, data: res.rows[0], message: 'Заказ успешно создан', status: 200}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.updateOrder = async (ip, headers, id, body) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        let res = await pool.query(`
            UPDATE orders SET
            username = $1,
            phone = $2,
            address = $3,
            productid = $4,
            title = $5,
            image = $6,
            memory = $7,
            price = $8,
            status = $9
            WHERE ordersid = $9
            RETURNING *`,
            [body.username, body.phone, body.address, body.productid, body.title, body.image, body.memory, body.price, body.status, id])

        return {success: true, message: 'Заказ обновлен', data: res.rows[0], status: 200}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
} 

Views.closeOrder = async (id, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        
        if(!access.success) return access

        let res = await pool.query(`UPDATE orders SET status = $1 WHERE ordersid = $2`, ['old', id])

        return {success: true, message: 'Заказ завершен', status: 200, data: res.rows[0]}

    } catch(e) {
        console.log(e)
        return {success: false, message: e.message, status: 500}
    }
}

Views.deleteOrder = async (id, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        let res = await pool.query(`DELETE FROM orders WHERE ordersid = $1`, [id])

        return {success: true, status: 200, message: 'Заказ удалён', data: res.rows[0]}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

/*Заказы по услугам*/
Views.getAllServiceOrders = async () => {
    try {
        
        let resNew = await pool.query(`SELECT * FROM servicesOrders WHERE status = $1 ORDER BY datetime DESC`, ['new'])
        let resOld = await pool.query(`SELECT * FROM servicesOrders WHERE status = $1`, ['old'])

        return {success: true, status: 200, data: {newOrders: resNew.rows, oldOrders: resOld.rows}}
    } catch (e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.createServiceOrder = async (body) => {
    try {
        
        let res = await pool.query(`
            INSERT INTO servicesOrders
            (name, service_name, phone, price)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [body.name, body.service_name, body.phone, body.price])

        return {success: true, message: 'Заказ отправлен', data: res.rows[0]}

    } catch (e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.updateServiceOrder = async (ip, headers, id, body) => {
    try {
        
        let access = jwt.checkTokenAdmin(headers, ip)   
        if(!access.success) return access

        let res = await pool.query(`
            UPDATE servicesOrders SET
            name = $1,
            service_name = $2,
            phone = $3,
            price = $4
            WHERE servicesid = $5
            RETURNING *
        `, [body.name, body.service_name, body.phone, body.price, id])

        return {success: true, message: 'Заказ обновлён', data: res.rows[0]}

    } catch (e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.closeServiceOrder = async (ip, headers, id, body) => {
    try {
        
        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access

        let res = await pool.query(`
            UPDATE servicesOrders SET
            status = $1
            WHERE servicesid = $2
            RETURNING *
        `, ['old', id])

        return {success: true, message: 'Заказ закрыт', data: res.rows[0]}

    } catch (e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.deleteServiceOrder = async (id, headers, ip) => {
    try {

        let access = jwt.checkTokenAdmin(headers, ip)
        if(!access.success) return access
        
        let res = await pool.query(`DELETE FROM servicesOrders WHERE servicesid = $1`, [id])

        return {success: true, status: 200, message: 'Заказ удалён', data: res.rows[0]}
    } catch (e) {
        return {success: false, message: e.message, status: 500}
    }
}


export default Views;