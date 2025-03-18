const express = require('express');
const multer = require('multer');
const pdf2docx = require('pdf2docx');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const pdfPath = req.file.path;
    const docxPath = path.join(__dirname, 'converted.docx');

    pdf2docx.convert(pdfPath, docxPath, (err, result) => {
        if (err) {
            return res.status(500).send('Conversion failed.');
        }

        res.download(docxPath, 'converted.docx', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
            }
            // Clean up files
            fs.unlinkSync(pdfPath);
            fs.unlinkSync(docxPath);
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
