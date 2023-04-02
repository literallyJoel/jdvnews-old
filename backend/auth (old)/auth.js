/*
    This was the old native auth code that has now been replaced by keycloak sso
*/


// const express = require("express");
// const router = express.Router();
// const db = require("./db");
// const bcrypt = require("bcrypt");
// const bodyParser = require("body-parser");
// const jwt = require("jsonwebtoken");
// const jwtSecret = require("./vars").jwtSecret;
// const parser = bodyParser.urlencoded({ extended: false });
// const { body, validationResult } = require('express-validator');

// //Checks if a token is valid
// router.post("/authorise", (req, res) => {
//     try {
//         //Grabs the token from the auth header and verifies/decodes it.
//         const token = req.headers.authorization.split(" ")[1];
//         const decoded = jwt.verify(token, jwtSecret);

//         //Grabs the user info using their email grabbed from the token.
//         db.getByEmail(decoded.userEmail).then((accounts) => {
//             //Checks the account still exists and if it has the reauth tag
//             if (accounts.length === 0 || accounts[0].reauth) {
//                 //If the account doesn't exist of has the reauth tag then reject
//                 res.status(401).send({
//                     message: "unauthorised"
//                 });
//             } else {
//                 //If account exists and doesn't have reauth tag then accept
//                 res.status(200).send("OK");
//             }
//         })
//     } catch (e) {
//         //If there are any other issues send unauthorized.
//         res.status(401).send({
//             message: "Unauthorized,"
//         });
//     }
// });

// //Logs the user in.
// router.post("/login",
//     parser,
//     //validates the inputs
//     body("email").isEmail().withMessage("invalid email"),
//     body("password").isLength({ min: 7 }).trim().escape().withMessage("invalid password"),
//     (req, res) => {

//         //checks for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).send({ errors: errors.array() });
//         }

//         //Grabs the current datetime for error logging.
//         const now = new Date();
//         try {

//             //If form input is valid then grab the user by their email
//             db.getByEmail(req.body.email).then((accounts) => {
//                 //If there are no users with that email send error.
//                 if (accounts.length === 0) {
//                     res.status(404).send({
//                         message: "Account Issue"
//                     });
//                 } else {
//                     //If account exists grab the account.
//                     const account = accounts[0];

//                     //Use bcrypt to compare against the hashed & salted password
//                     bcrypt
//                         .compare(req.body.password, account.password)
//                         .then((passwordCheck) => {
//                             //If the passwords don't match reject
//                             if (!passwordCheck) {
//                                 return res.status(404).send({
//                                     message: "Account Issue   "
//                                 });
//                             }

//                             //If the password does match, send a token.
//                             const token = jwt.sign({
//                                 userId: account.id,
//                                 userEmail: account.email,
//                                 userName: account.name,
//                             },
//                                 jwtSecret, {
//                                 expiresIn: "24h"
//                             }
//                             );

//                             res.status(200).send({
//                                 message: "Login Success",
//                                 email: account.email,
//                                 token,
//                             });
//                         })
//                         .catch((err) => {
//                             //If there are any errors log with the current datetime
//                             console.error(`[${now}]: ${err}`);
//                             res.status(404).send({
//                                 message: "Account Issue"
//                             });
//                         });
//                 }
//             });
//         } catch {
//             //If there are any errors log with the current datetime
//             console.error(`[${now}]: ${err}`);
//             res.status(500).send({
//                 message: "Internal Server Error"
//             });
//         }
//     }
// );

// //Registers a user
// router.post(
//     "/register",
//     parser,
//     //Validates the inputs
//     body("name").not().isEmpty().escape().withMessage("invalid name"),
//     body("email").isEmail().normalizeEmail().withMessage("invalid email"),
//     body("password").isLength({ min: 7 }).trim().escape().withMessage("invalid password"),
//     (req, res) => {
//         try {

//             //checks for validation errors
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).send({ errors: errors.array() });
//             }


//             // Generate a salt for the password hash
//             bcrypt.genSalt(14, (err, salt) => {
//                 if (err) {
//                     console.error(err);
//                     return res.status(500).send({
//                         message: "Internal Server Error"
//                     });
//                 }

//                 // Hash the password with the generated salt
//                 bcrypt.hash(req.body.password, salt, (err, hashedPass) => {
//                     if (err) {
//                         console.error(err);
//                         return res.status(500).send({
//                             message: "Internal Server Error"
//                         });
//                     }

//                     //push the new user to the users DB
//                     const user = ({
//                         email: req.body.email,
//                         name: req.body.name,
//                         password: hashedPass,
//                     });

//                     db.register(user);

//                     //Send OK
//                     res.status(200).send("OK");
//                 });
//             });
//         } catch (err) {
//             //Log any errors with the current datetime and send 500
//             const now = new Date();
//             console.error(`[${now}]: ${err}`);
//             res.status(500).send({
//                 message: "Internal Server Error"
//             });
//             throw err;
//         }
//     });


// module.exports = router;