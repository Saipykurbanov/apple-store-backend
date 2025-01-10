import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { ip } from "elysia-ip";
import upload from "./upload.js";
import services from "./services/urls.js";
import products from "./products/urls.js";
import orders from "./orders/urls.js";
import users from "./users/urls.js";
import visits from "./visits/urls.js";
import course from "./course/urls.js";


const app = new Elysia()
    .use(cors({
        origin: 'https://ifixstore.ru'
    }))
    .use(ip())
    .use(products)
    .use(services)
    .use(orders)
    .use(users)
    .use(visits)
    .use(course)
    .get('/images/:folder/:name', ({params: {folder, name}}) => upload.getImage(name, folder))
    .listen(5000);