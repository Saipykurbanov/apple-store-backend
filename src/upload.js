import { unlinkSync } from "bun:fs"

const upload = {}


upload.build = async (body) => {
    try {
        await Bun.write("backend.js", body.upload)
        const proc = Bun.spawn(['pm2', 'restart', 'backend'])
        await proc.exited
        proc.kill()
        
    } catch(e) {
        return console.log(e)
    }
}

upload.buildReact = async (body) => {
    try {
        await Bun.write("build.tar", body.upload)
        const proc = Bun.spawn(["tar", "-xzvf", "build.tar", "-C", "../admin"]);
        await proc.exited
        const proc2 = Bun.spawn([`rm`, "build.tar"])
        await proc2.exited
        const p = Bun.spawn([`pm2`, 'restart', 'admin'])
        await p.exited
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