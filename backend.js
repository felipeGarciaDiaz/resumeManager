var express = require("express"),
    formidable = require("formidable"),
    crypto = require("crypto"),
    app = express(),
    port = 11223;

app.use("/", express.static(__dirname + "/app/"));
app.use("/Media", express.static(__dirname + "/app/Media/"));


app.post("/", function(req, res) {
    var form = new formidable.IncomingForm();
    form.maxFileSize = 2000000;
    form.encoding = "utf-8";
    form.parse(req)
    .on("fileBegin", (name, file) => {

        seed = crypto.randomBytes(3).toString("hex");
        file.path = __dirname + "/app/Media/" + seed + file.name;
        console.log("File Name: " + file.name)

        extCheck = file.type.split("/").pop();
        if(extCheck != "pdf") {
            form.maxFileSize = 0;
        }

    })
    .on("file", (name, file) => {

        console.log("file:", name, file);
        res.redirect("/Media/" + seed + file.name);

    })
    .on("error", (err) => {

        console.log("whoops! there was an error! \n " + err);

    })
    .on("end", () => {

        console.log("finished! :)");
        res.end();

    });

});
app.get("/Media/", function(req, res) {
    console.log(req.IncomingForm);
});




app.listen(port, function(req, res) {
    console.log("server is up and running using port: " + port);
});