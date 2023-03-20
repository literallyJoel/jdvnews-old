const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Vault = require("node-vault");
const Parser = require("rss-parser");
const parser = new Parser();
const mysql = require("mysql2");

//TODO: Do this properly - temp unsecure solution
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
        //Logs into vault using the approle set up for JDVNews  
        const result = await VaultClient.approleLogin({
            role_id: roleId,
            secret_id: secretId
        });

        //Grabs the auth token
        VaultClient.token = result.auth.client_token;

        //Grabs the database login info
        const { data } = await VaultClient.read("jdvnews/data/data/mysql");
        return data;
    } catch (e) {
        console.error(e);
        return (e);
    }
}


app.post("/login", async (req, res) => {
    //Gets the db info
    const result = await getDB();

    //Creates the MySQL connection to the database
    const connection = mysql.createConnection({
        host: 'localhost',
        user: result.data.user,
        password: result.data.password,
        database: result.data.database
    });

    //Sets up the query for seeing if the user exists in the db.
    //Auth is done through keycloak - so there's no real registration process. 
    //However, logging in should allow users to customise their feed, so we store their user ID.
    const firstQuery = `SELECT * FROM accounts WHERE userID = ?`;
    const sub = [req.body.sub];

    //This runs the query to check if the user has already had their ID stored
    connection.query(firstQuery, sub, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
            return;
        }

        //If there ID isn't stored it stores it.
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
        //If there ID is already stored we don't need to do anything, so we just send an OK response.
        } else {
            res.status(200).send("OK");
        }
    });
});




//This is for parsing RSS feeds
app.post('/parse-feeds', async (req, res) => {
    try {
        //We grab the feedlinks from the request body
        const feedLinks = req.body.feeds;
        //Parse all the feeds as promises
        const feedPromises = feedLinks.map((feedLink) => parser.parseURL(feedLink));
        //Resolve all the promises
        const feeds = await Promise.all(feedPromises);
        //Return all the parsed feeds
        res.json(feeds);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(5500, () => {
    console.log("Running on 5500");
});
