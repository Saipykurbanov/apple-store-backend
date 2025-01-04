import Elysia, { t } from "elysia";
import Views from "./views";


const products = new Elysia({prefix: '/api/products'})
    .get('/all', ({query}) => Views.getAllProducts(query))
    .delete('/delete/:id', ({params: {id}, headers, ip}) => Views.deleteProduct(id, headers, ip))
    .post('/create', ({body, headers, ip}) => Views.createProduct(body, headers, ip), {
        schema: {
            body: {
                title: t.String(),
                price: t.Integer(),
                main_image: t.Files(),
                memory: t.String(),
                specifications: t.Array(),
                color: t.String(),
                colorName: t.String()
            }
        }
    })
    .put('/update/:id', ({body, headers, ip, params: {id}}) => Views.updateProduct(body, headers, ip, id), {
        schema: {
            body: {
                title: t.String(),
                price: t.Integer(),
                main_image: t.Files(),
                memory: t.String(),
                specifications: t.String(),
                color: t.String(),
                colorName: t.String(),
                // Файлы
                mainFile: t.Files()
            }
        }
    })

export default products;