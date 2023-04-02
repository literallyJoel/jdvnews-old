/*
    This was the old native auth code that has now been replaced by keycloak sso
*/


// const mysql = require("mysql2");
// const dbInfo = require("./vars").dbInfo;
// const db = mysql.createConnection(dbInfo);


// function register(user) {
//     db.connect((err) => {
//         now = new Date();
//         if (err) {
//             console.error(`[${now}]: ${err}`);
//         } else {
//             console.log(`[${now}]: MySQL Connection Established`);

//             sql = "INSERT INTO accounts (name, email, password) VALUES (?, ?, ?)";
//             const values = [user.name, user.email, user.password]

//             db.query(sql, values, (err, res) => {
//                 const now = new Date();
//                 if (err) {
//                     console.error(`[${now}]: ${err}`);
//                 } else {
//                     console.log(`[${now}]: Record inserted into users database`);
//                 }
//             });
//         }


//     });

// }

// function getByEmail(email) {
//     return new Promise((resolve, reject) => {
//         db.connect((err) => {
//             const now = new Date();
//             if (err) {
//                 console.error(`[${now}]: ${err}`)
//                 reject(err);
//             } else {
//                 sql = "SELECT * FROM accounts WHERE email = ?";
//                 db.query(sql, [email], (error, results, fields) => {
//                     if (error) {
//                         console.error(`[${now}]: ${error}`);
//                         reject(error);
//                     } else {
//                         resolve(results);
//                     }
//                 })
//             }
//         });
//     });
// }


// module.exports = {
//     register: register,
//     getByEmail: getByEmail,
// };