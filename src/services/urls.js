import Elysia, { t } from "elysia";
import Views from "./views";


const services = new Elysia({prefix: '/api/services'})
    .get('/all', () => Views.getAllServices())
    .delete('/delete/:id', ({params: {id}, headers, ip}) => Views.deleteServices(id, headers, ip))
    .post('/create', ({body, headers, ip}) => Views.createServices(body, headers, ip), {
        schema: {
            body: {
                image: t.Files(),
                title: t.String(),
                description: t.String(),
                price: t.Integer(),
            }
        }
    })
    .put('/update/:id', ({params: {id}, body, headers, ip}) => Views.updateServices(id, body, headers, ip), {
        schema: {
            body: {
                file: t.Files(),
                image: t.String(),
                title: t.String(),
                description: t.String(),
                price: t.Integer(),
            }
        }
    })
    
export default services;