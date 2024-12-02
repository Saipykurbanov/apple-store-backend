import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { ip } from "elysia-ip";
import upload from "./upload";


const app = new Elysia()
    .use(cors())
    .use(ip())
    .get('/images/:name', ({params: {name}}) => upload.getImage(name))
    .listen(5000);
