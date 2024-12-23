import { Pool } from 'pg'

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'apple-store',
    password: 'admin',
    port: 5432,
})

const createtables = async () => {
    try {

        await pool.query(`CREATE TABLE IF NOT EXISTS products (
            productid SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            price INT NOT NULL, 
            discount SMALLINT,
            main_image TEXT,
            images TEXT[],
            available BOOLEAN DEFAULT false,
            new BOOLEAN DEFAULT false,
            datetime TIMESTAMP DEFAULT LOCALTIMESTAMP
        )`)

        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            userid SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'client',
            ban BOOLEAN DEFAULT false,
            active BOOLEAN DEFAULT false
        )`)

        await pool.query(`CREATE TABLE IF NOT EXISTS services (
            servicesid SERIAL PRIMARY KEY,
            image TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            price INT NOT NULL,
            datetime TIMESTAMP DEFAULT LOCALTIMESTAMP
        )`)
        
        await pool.query(`CREATE TABLE IF NOT EXISTS orders (
            ordersid SERIAL PRIMARY KEY,
            username TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            poductid INT NOT NULL,
            datetime TIMESTAMP DEFAULT LOCALTIMESTAMP
        )`)

        await pool.query(`CREATE TABLE IF NOT EXISTS visits (
            visitid SERIAL PRIMARY KEY,
            count INT DEFAULT 1,
            day INT,
            month INT,
            year INT
        )`)

        console.log('database init')
    }
    catch (e) {
        console.log(e)
    }
}

createtables()

export default pool;