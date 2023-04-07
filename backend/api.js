const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Vault = require("node-vault");
const Parser = require("rss-parser");
const parser = new Parser();
const mysql = require("mysql2");
const Keycloak = require("keycloak-connect");
const debug = require("debug");

process.env.NODE_DEBUG = 'node-vault';
//Vault role ID
const roleId = "d602bc2c-d71f-e592-bc6a-5380850146d4"
//Vault unwrap token
const unwrapToken = process.argv[2];

//Makes sure unwrap token provided. If not alerts and closes the server.
if (!unwrapToken) {
    console.error("Please provide a wrap token as an argument")
    process.exit(1);
}


const keycloak = new Keycloak({
    clientId: "news.jdvivian.co.uk",
    bearerOnly: "true",
    serverURL: "https://cloak.jdvivian.co.uk",
    realm: "JDVSite"

});

app.use(keycloak.middleware());

app.use(bodyParser.json());
//Sets up the Vault Client for getting info from Vault
const VaultClient = Vault({
    apiVersion: "v1",
    endpoint: "https://vault.jdvivian.co.uk",
    token: unwrapToken
});



//Authorises the application with vault when the server starts
async function vaultAuth() {
    try {
        //unwrap the secret ID, then authenticate with Vault
        const unwrapRes = await VaultClient.unwrap();
        const secretId = unwrapRes.data.secret_id;
        const result = await VaultClient.approleLogin({
            role_id: roleId,
            secret_id: secretId
        });

        VaultClient.token = result.auth.client_token;
        console.log(VaultClient.token);

        console.log("Vault Authenticated");


    } catch (e) {
        console.error(`Vault Authenticated Failed: ${e}`);
        return (e);
    }
}

vaultAuth();

async function renewVaultAuth() {
    //renew the token
    const result = await VaultClient.tokenRenewSelf();
    VaultClient.token = result.auth.client_token;
    console.log("Token Renewed");
}

//Renew the token every 30 minutes.
const tokenRefreshInterval = setInterval(renewVaultAuth, 180000);
const getDB = async () => {
    //Gets the Database info from Vault
    try {
        //Grabs the database login info
        const { data } = await VaultClient.read("jdvnews/data/data/mysql");
        return data;
    } catch (e) {
        console.error(e);
        return (e);
    }
}

const getOpenAIKey = async () => {
    //Gets the OpenAI key from secrets storage
    try {
        const { data } = await VaultClient.read("jdvnews/data/data/openai");
        return (data);
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

//This is for getting a users RSS feeds
app.get("/getRSS", keycloak.protect(), async (req, res) => {
    const result = await getDB();
    //Creates the MySQL connection to the database
    const connection = mysql.createConnection({
        host: 'localhost',
        user: result.data.user,
        password: result.data.password,
        database: result.data.database
    });

    const allFeeds = "SELECT accountfeeds.FeedFriendlyName, rssfeeds.FeedLink, rssfeeds.FeedID from rssfeeds INNER JOIN accountfeeds ON rssfeeds.FeedID = accountfeeds.feedID WHERE accountfeeds.userID = ?";
    const selectedFeeds = "SELECT accountfeeds.FeedFriendlyName, rssfeeds.FeedLink, rssfeeds.FeedID from rssfeeds INNER JOIN accountfeeds ON rssfeeds.FeedID = accountfeeds.feedID WHERE accountfeeds.userID = ? AND rssfeeds.FeedID = ?";
    const sub = [req.kauth.grant.access_token.content.sub];

    var data = ""
    if (req.query.id) {
        data = [req.kauth.grant.access_token.content.sub, req.query.id];
    };

    connection.query(req.query.id ? selectedFeeds : allFeeds, req.query.id ? data : sub, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
            return;
        }

        res.send(results);
    });

});

app.get("/removeRSS", keycloak.protect(), async (req, res) => {
    const result = await getDB();

    const connection = mysql.createConnection({
        host: 'localhost',
        user: result.data.user,
        password: result.data.password,
        database: result.data.database
    });

    const removeRSS = "DELETE FROM accountfeeds WHERE feedID=? AND userID=?";
    const sub = [req.kauth.grant.access_token.content.sub];
    const data = [req.query.id, sub];

    connection.query(removeRSS, data, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
            return;
        }

        res.status(200).send("OK");
    });


});

app.post("/getSummary", keycloak.protect(), async (req, res) => {
    const openAIToken = await getOpenAIKey();
    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            { "role": "system", "content": "Your job is to summarise news headlines. You will recieve a list of headlines, and you should respond with a summary of these headlines in a friendly and conversational manor. You should not add any information to the summary that is not already in the headline, all information in the summaries should come directly from the headlines. The summary should be in paragraph format, and you should return only the summary with no greetings" },
            { "role": "user", "content": `${req.body.titles}` }
        ]
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAIToken.data.auth}`
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        const newsSummary = responseData.choices[0].message.content;
        res.status(200).send(newsSummary);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
    }
})

app.listen(5500, () => {
    console.log("Running on 5500");
});
