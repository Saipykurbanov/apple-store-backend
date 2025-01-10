import { unlinkSync } from "bun:fs"

const upload = {}

upload.build = async (body) => {
    try {
        await Bun.write("client.js", body.upload)
        const proc = Bun.spawn(['pm2', 'restart', 'client'])
        await proc.exited
        proc.kill()
    } catch(e) {
        return console.log(e)
    }
}

upload.image = async (name, image, folder) => {
    try {
        if(image === 'undefined') {
            return {success: false}
        }
        await Bun.write(`./images/${folder}/${name}`, image)
        return {success: true}
    } catch(e) {
        return {success: false}
    }
}

upload.getImage = (name, folder) => {
    let image = Bun.file(`./images/${folder}/${name}`)
    if(image.size === 0) {
        return Bun.file('./images/default.webp') //Заглушка если нету изображения
    } else {
        return image
    }
}

upload.deleteImage = (name, folder) => {
    let image = Bun.file(`./images/${folder}/${name}`)
    if(image.size !== 0) {
        return unlinkSync(`./images/${folder}/${name}`)
    }
}

export default upload