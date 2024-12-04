import Elysia, { t } from "elysia";
import Views from "./views";


const products = new Elysia({prefix: '/api/products'})
    .get('/all', ({query}) => Views.getAllProducts(query))
    .delete('/delete/:id', ({params: {id}, headers, ip}) => Views.deleteProduct(id, headers, ip))
    .post('/create', ({body, headers, ip}) => Views.createProduct(body, headers, ip), {
        schema: {
            body: {
                title: t.String(),
                description: t.String(),
                price: t.Integer(),
                discount: t.Integer(),
                main_image: t.Files(),
                images: t.Array(t.File()),
                available: t.Boolean(),
                new: t.Boolean(),
                datetime: t.Date(),
            }
        }
    })

export default products;