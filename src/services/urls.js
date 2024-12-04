import Elysia, { t } from "elysia";
import Views from "./views";


const services = new Elysia({prefix: '/api/services'})
    
    
export default services;