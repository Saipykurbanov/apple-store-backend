import Elysia, { t } from "elysia";
import Views from "./views.js";

const visits = new Elysia({prefix: '/api/visits'})
    .get('/all', () => Views.getAllVisits())
    .get('/today', () => Views.getToday())
    .post('/add', ({ip}) => Views.addVisits(ip))

export default visits;