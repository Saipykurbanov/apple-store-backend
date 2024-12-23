import Elysia, { t } from "elysia";
import Views from "./views";

const visits = new Elysia({prefix: '/api/visits'})
    .get('/all', () => Views.getAllVisits())
    .get('/today', () => Views.getToday())
    .post('/add', () => Views.addVisits())

export default visits;