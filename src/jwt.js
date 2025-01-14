import utils from "./utils.js";

const jwt = {}

jwt.create = (user, ip) => {
    
    const data = {
        user_id: user.userid,
        role: user.role,
        ip: ip
    }

    return utils.AES.encrypt(JSON.stringify(data), utils.token).toString()
}

jwt.checkTokenAdmin = (headers, ip) => {

    let token = utils.getToken(headers)

    if(token.ip !== ip) {
        return  {success: false, status: 401, message: 'Токен не действителен'}
    }

    if(token.role !== 'admin') {
        return {success: false, message: 'Недостаточно прав', status: 401}
    }

    return {success: true, message: 'Доступ разрешен'}
}

export default jwt;