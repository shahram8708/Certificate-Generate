const express = require('express');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generateCertificate', (req, res) => {
    let { recipientName, courseName, issueDate, image, images } = req.body;

    // Convert text to uppercase
    recipientName = recipientName.toUpperCase();
    courseName = courseName.toUpperCase();
    issueDate = issueDate.toUpperCase();

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'certificates', 'certificate.pdf');
    const writeStream = fs.createWriteStream(filePath);

    const backgroundImagePath = path.join(__dirname, 'background.jpg');
    const fontPath = path.join(__dirname, 'GreatVibes-Regular.ttf');

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
        .image(image, 115, 310, { width: 40, height: 40, align: "center" })
        .moveDown()
        .image(images, 80, 480, { width: 50, height: 50, align: "center" })
        .fontSize(20)
        .text("Signature", 60, 550);

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
