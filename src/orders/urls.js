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

export default orders;