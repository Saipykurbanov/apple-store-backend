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

Views.createProduct = async (body) => {
    try {
        
        

    } catch(e) {
        return {success: false, status: 500, message: e.message}
    }

}

export default Views;