import Elysia, { t } from "elysia";
import Views from "./views.js";

const orders = new Elysia({prefix: '/api/orders'})
    .get('/all', () => Views.getAllOrders())
    .get('/statistics', () => Views.getStatistics())
    .post('/create', ({body}) => Views.createOrder(body), {
        schema: {
            body: {
                username: t.String(),
                phone: t.String(),
                address: t.String(),
                productid: t.Integer(),
                title: t.String(),
                image: t.String(),
                memory: t.String(),
                price: t.Integer(),
                color: t.String(),
                colorname: t.String()
            }
        }
    })
    .put('/update/:id', ({params: {id}, body, ip, headers}) => Views.updateOrder(ip, headers, id, body), {
        schema: {
            body: {
                username: t.String(),
                phone: t.String(),
                address: t.String(),
                productid: t.Integer(),
                title: t.String(),
                image: t.String(),
                memory: t.String(),
                price: t.Integer(),
                color: t.String(),
                colorname: t.String()
            }
        }
    })
    .put('/close/order/:id', ({params: {id}, ip, headers}) => Views.closeOrder(id, headers, ip))
    .delete('/delete/:id', ({params: {id}, ip, headers}) => Views.deleteOrder(id, headers, ip))
    .get('/services/all', () => Views.getAllServiceOrders())
    .post('services/create', ({body}) => Views.createServiceOrder(body), {
        schema: {
            body: {
                name: t.String(),
                service_name: t.String(),
                phone: t.String(),
                price: t.Integer()
            }
        }
    })
    .put('/services/update/:id', ({params: {id}, ip, headers, body}) => Views.updateServiceOrder(ip, headers, id, body), {
        schema: {
            body: {
                name: t.String(),
                service_name: t.String(),
                phone: t.String(),
                price: t.Integer()
            }
        }
    })
    .put('services/close/:id', ({params: {id}, ip, headers, body}) => Views.closeServiceOrder(ip, headers, id, body))
    .delete('services/delete/:id', ({params: {id}, headers, ip}) => Views.deleteServiceOrder(id, headers, ip))


export default orders;