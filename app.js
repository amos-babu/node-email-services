require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const app = express();
const PORT  = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/api/contact', [
    check('name').isLength({ min: 3, max: 50 }).escape().trim().withMessage("Name must be 3 to 50 characters"),
    check('email').isEmail().normalizeEmail().withMessage("Email must be an email"),
    check('phone_number').isMobilePhone().escape().trim().withMessage("Invalid phone number"),
    check('message').isLength({ min: 3, max: 255 }).escape().trim().withMessage("Message must be 3 to 255 characters")
], async (req, res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.status(422).json({errors: errors.array()});
   }

   const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    })

    const mailOptions = {
        from: req.body.email,
        to: 'okumuamos88@gmail.com',
        subject: `Contact from ${req.body.name}, phone number: ${req.body.phone_number}`,
        text: req.body.message
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: "Message Sent Successfully" });
    } catch (error) {
        console.error("Error sending message", error);
        res.status(500).json({ msg: "Message Not Sent", error });
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});