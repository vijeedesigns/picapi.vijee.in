const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require('fs');
const sharp = require('sharp');

global.appRoot = path.resolve(__dirname);

const PORT = 5000;

const server = express();

server.use(
    cors({
        origin: "*",
    })
);

server.use(bodyParser.json({ limit: "200mb" }));
server.use(bodyParser.text({ limit: "200mb" }));
server.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

server.use(express.static("assets"));

server.get("/", (req, res) => {
    res.send(`<div>
        <div>Hello!</div>
        <div>Welcome to picapi.vijee.in API.</div>
        <div>V1.0.1</div>
    </div>`);
});

server.get("/:w/:h", (req, res) => {
    const maxWidth = Number(req.params.w) || 100;
    const maxHeight = Number(req.params.h) || 100;

    const directoryPath = appRoot + '/assets/uploads/';

    // Get all the files in the directory
    const files = fs.readdirSync(directoryPath);

    // Choose a random file
    const randomFile = files[Math.floor(Math.random() * files.length)];

    // Do something with the file content
    const imgPath = directoryPath + randomFile;

    // Load the image
    const image = sharp(imgPath);

    // Resize the image
    const resizedImage = image.resize(maxWidth, maxHeight);

    // Return the resized image
    resizedImage.toBuffer((err, info) => {
        res.end(info);
    });
});

server.listen(PORT, () => {
    console.log(`picapi.vijee.in app listening http://localhost:${PORT}`);
});
