import Elysia, { t } from "elysia";
import Views from "./views";


const users = new Elysia({prefix: '/api/users'})
    .post('/init', ({headers, ip}) => Views.init(headers, ip))
    .post('/signin', ({body, ip}) => Views.signIn(body, ip), {
        schema: {
            body: {
                email: t.String(),
                password: t.String()
            }
        }
    })
    
export default users;