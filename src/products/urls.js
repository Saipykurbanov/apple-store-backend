import Elysia, { t } from "elysia";
import Views from "./views.js";


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
    .put('/update/:id', ({params: {id}, body, headers, ip}) => Views.updateProduct(body, headers, ip, id), {
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
            body: {
                file: t.Files(),
                description: t.String(),
                article: t.String(),
                imageName: t.String()
            }
        }
    })
    .put('/specification/update/:id', ({params: {id}, ip, headers, body}) => Views.updateSpecification(body, headers, ip, id), {
        schema: {
            body: {
                file: t.Files(),
                icon: t.String(),
                description: t.String()
            }
        }
    })

export default products;