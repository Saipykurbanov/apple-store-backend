import Elysia, { t } from "elysia";
import Views from "./views";

const orders = new Elysia({prefix: '/api/orders'})

export default orders;