import pool from "../db";
import jwt from "../jwt";
import utils from "../utils";

const Views = {}

Views.getAllSetvices = async () => {
    try {

        let res = await pool.query(`SELECT * FROM services`)

        return {success: true, status: 200, data: res.rows}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}



export default Views;