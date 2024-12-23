import pool from "../db";
import jwt from "../jwt";
import utils from "../utils";

const Views = {}

Views.getAllVisits = async () => {
    try {

        let req = await pool.query(`SELECT * FROM visits`)

        return {success: true, status: 200, data: req.rows}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.getToday = async () => {
    try {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        let req = await pool.query(`
            SELECT * FROM visits WHERE day = $1 AND month = $2 AND year = $3`, 
            [day, month, year])
        let visit = req.rows[0]

        if(visit) {
            return {success: true, status: 200, data: visit.count}
        } 

        return {success: true, status: 200, data: 0}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

Views.addVisits = async () => {
    try {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        let req = await pool.query(`
            SELECT * FROM visits WHERE day = $1 AND month = $2 AND year = $3`, 
            [day, month, year])
        let visit = req.rows[0]

        if(visit) {
            await pool.query(`UPDATE visits SET count = $1 WHERE visitid = $2`, [(visit.count + 1), visit.visitid])
        } else {
            await pool.query(`INSERT INTO visits (day, month, year) VALUES ($1, $2, $3)`, [day, month, year])
        }

        return {success: true, status: 200}

    } catch(e) {
        return {success: false, message: e.message, status: 500}
    }
}

export default Views;