const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require('fs');
const Jimp = require("jimp");

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
    let ratio = 0;

    const directoryPath = appRoot + '/assets/uploads/';

    // Get all the files in the directory
    const files = fs.readdirSync(directoryPath);

    // Choose a random file
    const randomFile = files[Math.floor(Math.random() * files.length)];

    // Do something with the file content
    const imgPath = directoryPath + randomFile;

    Jimp.read(imgPath, (err, image) => {
        if (err) readDummyImage(res);
        if(image) {
            const width = image?.bitmap?.width || 50; // the width of the image
            const height = image?.bitmap?.height || 50; // the height of the image
            let newWidth = 0;
            let newHeight = 0;
        
            // Check if the current width is larger than the max
            if(width > maxWidth){
                ratio = maxWidth / width; // get ratio for scaling image
                newWidth = maxWidth; // Set new width
                newHeight = height * ratio; // Scale height based on ratio
            }
        
            // Check if current height is larger than max
            if(height > maxHeight){
                ratio = maxHeight / height; // get ratio for scaling image
                newWidth = width * ratio; // Scale width based on ratio
                newHeight = maxHeight; // Set new height
            }

            const jimpImg = width && height ? image?.resize(newWidth, newHeight) : image;
            const mime = jimpImg.getMIME();
            jimpImg.getBuffer(mime, (er, buffer) => {
                if (er) throw er;
                res.end(buffer);
            });
        }
    });
});

server.listen(PORT, () => {
    console.log(`picapi.vijee.in app listening http://localhost:${PORT}`);
});
