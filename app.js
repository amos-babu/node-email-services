const express = require("express");
const cors = require("cors");
const { check, validationResult } = require("express-validator");

const app = express();
const PORT  = 3000;

app.use(express.json());
app.use(cors());

app.post('/api/contact', [
    check('name').isLength({ min: 3, max: 50 }).escape().trim().withMessage("Name must be 3 to 50 characters"),
    check('email').isEmail().normalizeEmail().withMessage("Email must be an email"),
    check('phone_number').isMobilePhone().escape().trim().withMessage("Invalid phone number"),
    check('message').isLength({ min: 3, max: 255 }).escape().trim().withMessage("Message must be 3 to 255 characters")
], (req, res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.status(422).json({errors: errors.array()});
   }

   console.log(req.body);
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});