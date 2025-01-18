import Elysia, { t } from "elysia";
import Views from "./views.js";

const course = new Elysia({prefix: '/api/course'})
    .get('/dollar', () => Views.getDollar())
    .put('/update/:id', ({params: {id}, body, headers, ip}) => Views.updateCourse(ip, headers, id, body), {
        schema: {
            body: {
                value: t.Integer()
            }
        }
    })
    .post('/create', ({ip, headers, body}) => Views.createCourse(ip, headers, body), {
        schema: {
            body: {
                currency: t.String(),
                value: t.Integer()
            }
        }
    })
    .delete('/delete/:id', ({params: {id}, ip, headers}) => Views.deleteCourse(ip, headers, id))

export default course;