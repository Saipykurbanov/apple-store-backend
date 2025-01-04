import Elysia, { t } from "elysia";
import Views from "./views";

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
                price: t.Integer()
            }
        }
    })
    .put('/update/:id', ({body, params: {id}, ip, headers}) => Views.updateOrder(ip, headers, id, body), {
        schema: {
            body: {
                username: t.String(),
                phone: t.String(),
                address: t.String(),
                productid: t.Integer(),
                title: t.String(),
                image: t.String(),
                memory: t.String(),
                price: t.Integer()
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
                phone: t.String()
            }
        }
    })
    .put('/services/update/:id', ({ip, headers, body, params: {id}}) => Views.updateServiceOrder(ip, headers, id, body), {
        schema: {
            body: {
                name: t.String(),
                service_name: t.String(),
                phone: t.String()
            }
        }
    })
    .put('services/close/:id', ({ip, headers, body, params: {id}}) => Views.closeServiceOrder(ip, headers, id, body))
    .delete('services/delete/:id', ({params: {id}, headers, ip}) => Views.deleteServiceOrder(id, headers, ip))


export default orders;