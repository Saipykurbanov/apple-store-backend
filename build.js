const result = await Bun.build({
    entrypoints: ["./src/index.js"],
    outdir: "./out",
    minify: true,
    target: "bun",
    naming: "backend.js",
})

if(!result.success) {
    console.error("Build failed")
    for(const message of result.logs) {
        console.error(message)
    }
} else {
    const foo = Bun.file("./out/backend.js")
    const formData = new FormData()
    formData.append("upload", foo)

    let res = await fetch("http://31.130.148.215:5000/update/build/backend", {
        method: "POST",
        body: formData
    })

    res = await res.text()
    console.log(res)
}