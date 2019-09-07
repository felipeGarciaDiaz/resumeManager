var express = require("express"),
    formidable = require("formidable"),
    crypto = require("crypto"),
    app = express(),
    port = 11223;

app.use("/", express.static(__dirname + "/app/"));
app.use("/Media", express.static(__dirname + "/app/Media/"));
app.use(express.urlencoded());

app.post("/", function(req, res) {
    var form = new formidable.IncomingForm();
    form.maxFileSize = 2000000;
    form.encoding = "utf-8";
    form.parse(req)
    .on("fileBegin", 
    (name, file) => {

        ext = file.type.split("/").pop();
        seed = crypto.randomBytes(3).toString("hex");
        file.path = __dirname + "/app/Media/" + seed + "." + ext;
        console.log("File Name: " + file.name)

        if(ext != "pdf") {
            form.maxFileSize = 0;

            console.log("file is not a pdf");

        }

    })
    .on("file", (name, file) => {

        console.log("file:", name, file);
        res.redirect("/Media/" + seed + "." +  ext);

    })
    .on("error", (err) => {
        console.log("whoops! there was an error!");
        res.sendFile(__dirname + "/app/error.html");
    })
    .on("end", () => {

        console.log("finished! :)");
        res.end();

    });

});
app.post("/Media/", function(req, res) {
    res.redirect("/Media/" + req.body.searchPost);
    console.log(req.body.searchPost);
});
app.get("*", function (req, res) {
    res.status(404).sendFile(__dirname + "/app/error.html");
})
app.listen(port, function(req, res) {
    console.log("server is up and running using port: " + port);
});