import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { ip } from "elysia-ip";
import upload from "./upload";
import services from "./services/urls";
import products from "./products/urls";
import orders from "./orders/urls";
import users from "./users/urls";
import visits from "./visits/urls";
import course from "./course/urls";


const app = new Elysia()
    .use(cors())
    .use(ip())
    .use(products)
    .use(services)
    .use(orders)
    .use(users)
    .use(visits)
    .use(course)
    .get('/images/:folder/:name', ({params: {folder, name}}) => upload.getImage(name, folder))
    .listen(5000);