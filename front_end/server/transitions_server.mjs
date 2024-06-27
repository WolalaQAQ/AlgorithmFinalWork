import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const transitionsDir = path.join(__dirname, '../src/components/turing_machine/transitions');

app.get('/api/transitions', (req, res) => {
    fs.readdir(transitionsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
        res.json(jsonFiles);
    });
});

app.get('/api/transitions/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(transitionsDir, filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Unable to read file');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
