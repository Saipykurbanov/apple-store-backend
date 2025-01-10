import { Pool } from 'pg'

const pool = new Pool({
    user: 'admin',
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
            price INT NOT NULL,
            main_image TEXT,
            available BOOLEAN DEFAULT true,
            datetime TIMESTAMP DEFAULT LOCALTIMESTAMP,
            memory TEXT,
            color TEXT,
            colorName TEXT,
            article TEXT UNIQUE
        )`)

        await pool.query(`CREATE TABLE IF NOT EXISTS specifications (
            specificationsid SERIAL PRIMARY KEY,
            icon TEXT,
            description TEXT,
            article TEXT
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
            productid INT NOT NULL,
            title TEXT,
            image TEXT,
            memory TEXT,
            price INT,
            status TEXT DEFAULT 'new',
            datetime TIMESTAMP DEFAULT LOCALTIMESTAMP,
            color TEXT,
            colorname TEXT
        )`)

        await pool.query(`CREATE TABLE IF NOT EXISTS visits (
            visitid SERIAL PRIMARY KEY,
            day INT,
            month INT,
            year INT,
            count TEXT[]
        )`)

        await pool.query(`CREATE TABLE IF NOT EXISTS course (
            courseid SERIAL PRIMARY KEY,
            currency TEXT,
            value INT
        )`)

        await pool.query(`CREATE TABLE IF NOT EXISTS servicesOrders (
            servicesid SERIAL PRIMARY KEY,
            name TEXT,
            service_name TEXT,
            price INT,
            phone TEXT,
            status TEXT DEFAULT 'new',
            datetime TIMESTAMP DEFAULT LOCALTIMESTAMP
        )`)

        console.log('database init')
    }
    catch (e) {
        console.log(e)
    }
}

createtables()

export default pool;