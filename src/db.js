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
        await pool.query(`CREATE TABLE IF NOT EXISTS categories (
            categoryid SERIAL PRIMARY KEY,
            title TEXT
            image TEXT
        )`)

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
            datetime TIMESTAMP DEFAULT LOCALTIMESTAMP,
            slug TEXT UNIQUE
        )`)

        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            userid SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'client'
        )`)
        
        console.log('database init')
    }
    catch (e) {
        console.log(e)
    }
}

createtables()

export default pool;