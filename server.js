const express = require('express');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
let multer = require("multer")
let upload = multer({dest : "uploads/"})
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generateCertificate', upload.any(),(req, res,next) => {
    let { recipientName, courseName, issueDate } = req.body;
    
    recipientName = recipientName.toUpperCase();
    courseName = courseName.toUpperCase();
    issueDate = issueDate.toUpperCase();
    console.log(req.files.image);
    
    const backgroundImagePath = path.join(__dirname, 'public', req.body.selectedBackground);
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'certificates', 'certificate.pdf');
    const writeStream = fs.createWriteStream(filePath);


    const imageBuffer = fs.readFileSync(req.files[0].path);

    doc.image(backgroundImagePath, 0, 200, { width: 620, height: 400 })
        .fontSize(50)
        .text('CERTIFICATE', 100, 250, { align: 'center' })
        .fontSize(20)
        .text('This Is To Certify That', { align: 'center' })
        .moveDown(0.5)
        .lineWidth(1)
        .moveTo(250, doc.y)
        .lineTo(400, doc.y)
        .stroke()
        .moveDown(0.5)
        .fontSize(25)
        .text(recipientName, { align: 'center' })
        .moveDown()
        .fontSize(20)
        .text('Has Successfully Completed The Course', { align: 'center' })
        .moveDown(0.5)
        .lineWidth(1)
        .moveTo(250, doc.y)
        .lineTo(400, doc.y)
        .stroke()
        .moveDown(0.5)
        .fontSize(25)
        .text(courseName, { align: 'center' })
        .moveDown()
        .fontSize(25)
        .text(`On This Date, ${issueDate}`, { align: 'center', margin: [0, 20] })
        .moveDown()
        .image(imageBuffer, 90, 500, { width: 40, height: 40, align: 'center' })

    doc.end();

    writeStream.on('finish', () => {
        console.log('Certificate generated successfully!');
        res.sendFile(filePath);
    });

    doc.pipe(writeStream);

});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});