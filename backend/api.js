const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Vault = require("node-vault");
const Parser = require("rss-parser");
const parser = new Parser();
const mysql = require("mysql2");
const {roleId, secretId} = require("./vars");

app.use(bodyParser.json());
//Sets up the Vault Client for getting info from Vault
const VaultClient = Vault({
    apiVersion: "v1",
    endpoint: "https://vault.jdvivian.co.uk"
});




const getDB = async () => {
    //Gets the Database info from Vault
    try {
        const result = await VaultClient.approleLogin({
            role_id: roleId,
            secret_id: secretId
        });

        VaultClient.token = result.auth.client_token;

        const { data } = await VaultClient.read("jdvnews/data/data/mysql");
        return data;
    } catch (e) {
        console.error(e);
        return (e);
    }
}

app.post("/test", (req,res) =>{
    console.log(req.body);
    res.status(200).send("OK");
})
app.post("/login", async (req, res) => {
    const result = await getDB();

    const connection = mysql.createConnection({
        host: 'localhost',
        user: result.data.user,
        password: result.data.password,
        database: result.data.database
    });

    const firstQuery = `SELECT * FROM accounts WHERE userID = ?`;
    const sub = [req.body.sub];

    connection.query(firstQuery, sub, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
            return;
        }

        if (results.length === 0) {
            const secondQuery = `INSERT INTO accounts (userID) VALUES (?)`;

            connection.query(secondQuery, sub, (error, results, fields) => {
                if (error) {
                    console.error(error);
                    res.status(500).send("Internal Server Error");
                    return;
                }

                res.status(200).send("OK");
            })
        } else {
            res.status(200).send("OK");
        }
    });
});





app.post('/parse-feeds', async (req, res) => {
    try {
        const feedLinks = req.body.feeds;
        const feedPromises = feedLinks.map((feedLink) => parser.parseURL(feedLink));
        const feeds = await Promise.all(feedPromises);
        res.json(feeds);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(5500, () => {
    console.log("Running on 5500");
});
