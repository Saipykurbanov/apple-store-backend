import Elysia, { t } from "elysia";
import Views from "./views";


const services = new Elysia({prefix: '/api/services'})
    .get('/all', () => Views.getAllSetvices())
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
    
    
export default services;