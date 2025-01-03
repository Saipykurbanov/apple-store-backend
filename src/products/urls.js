import Elysia, { t } from "elysia";
import Views from "./views";


const products = new Elysia({prefix: '/api/products'})
    .get('/all', ({query}) => Views.getAllProducts(query))
    .delete('/delete/:id', ({params: {id}, headers, ip}) => Views.deleteProduct(id, headers, ip))
    .delete('/delete/specification/:id', ({params: {id}, headers, ip}) => Views.deleteSpecification(id, headers, ip))
    .post('/create', ({body, headers, ip}) => Views.createProduct(body, headers, ip), {
        schema: {
            body: {
                title: t.String(),
                price: t.Integer(),
                main_image: t.Files(),
                memory: t.String(),
                article: t.String(),
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
                main_image: t.String(),
                memory: t.String(),
                color: t.String(),
                colorName: t.String(),
                // Файлы
                mainFile: t.Files()
            }
        }
    })
    .post('/specification/create', ({ip, headers, body}) => Views.createSpecification(body, headers, ip), {
        schema: {
            body: t.Object({
                file: t.Files(),
                description: t.String(),
                article: t.String(),
                imageName: t.String()
            })
        }
    })
    .put('/specification/update/:id', ({ip, headers, body, params: {id}}) => Views.updateSpecification(body, headers, ip, id), {
        schema: {
            body: t.Object({
                image: t.Files(),
                description: t.String()
            })
        }
    })

export default products;