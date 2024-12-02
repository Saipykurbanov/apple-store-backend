import Elysia, { t } from "elysia";
import Views from "./views";


const products = new Elysia({prefix: '/api/products'})
    .get('/all', ({query}) => Views.getAllProducts(query))

export default products;