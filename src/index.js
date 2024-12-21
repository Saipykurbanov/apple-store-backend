import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { ip } from "elysia-ip";
import upload from "./upload";
import services from "./services/urls";
import products from "./products/urls";
import orders from "./orders/urls";


const app = new Elysia()
    .use(cors())
    .use(ip())
    .get('/images/:folder/:name', ({params: {folder, name}}) => upload.getImage(name, folder))
    .use(products)
    .use(services)
    .use(orders)
    .listen(5000);
