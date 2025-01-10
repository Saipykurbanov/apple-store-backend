import Elysia, { t } from "elysia";
import Views from "./views.js";


const users = new Elysia({prefix: '/api/users'})
    .post('/init', ({headers, ip}) => Views.init(headers, ip))
    .post('/signin', ({body, ip}) => Views.signIn(body, ip), {
        schema: {
            body: t.Object({
                name: t.String(),
                password: t.String()
            })
        }
    })
    .post('/signin/admin-panel', ({body, ip}) => Views.signInAdmin(body, ip), {
        schema: {
            body: t.Object({
                name: t.String(),
                password: t.String()
            })
        }
    })
    .post('/create', ({body}) => Views.createUser(body), {
        schema: {
            body: t.Object({
                name: t.String(),
                password: t.String()
            })
        }
    })
    
export default users;