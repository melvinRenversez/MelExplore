const express = require("express");
const cors = require("cors");
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 3000;

const extReadable = ['.txt', '.md', '.js', '.json', '.html', '.css'];

app.use(express.json());
app.use(cors());

app.post("/getCurrentPath", (req, res) => {
    console.log("GetCurrentDir");
    res.json({
        path: __dirname
    });
});

app.post("/getDirectoryContents", async (req, res) => {
    const dirPath = req.body.dirPath;

    const entries = await fs.readdir(dirPath);
    
    const result = await Promise.all(
        entries.map(async (name) => {
        const fullPath = require('path').join(dirPath, name);
        const stats = await fs.stat(fullPath);
    
        const ext = path.extname(name).toLowerCase();
        let readable = false;
    
            if (extReadable.includes(ext)) {
             readable = true;
            }
    
             return {
                name,
                path: fullPath,
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory(),
                size: stats.isFile() ? stats.size : "",
                readable
            };
        })
    );

    res.json({
        contents: result
    })
    
});

app.post("/openFile", async (req, res) => {
    const filePath = req.body.filePath;
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        res.json({
            content
        });
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
        throw err;
    }
})

app.listen(PORT, () => {
    console.log("server running on port", PORT);
});