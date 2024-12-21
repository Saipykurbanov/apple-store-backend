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

export default Views;