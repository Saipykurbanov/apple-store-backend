const result = await Bun.build({
    entrypoints: ["./src/index.js"],
    outdir: "./out",
    minify: true,
    target: "bun",
    naming: "client.js",
})

if(!result.success) {
    console.error("Build failed")
    for(const message of result.logs) {
        console.error(message)
    }
} else {
    const foo = Bun.file(".out/client.js")

    const formData = new FormData()
    formData.append("upload", foo)

    let res = await fetch("https://ifixstore/update/build", {
        method: "POST",
        body: formData
    })

    res = await res.text()
    console.log(res)
}