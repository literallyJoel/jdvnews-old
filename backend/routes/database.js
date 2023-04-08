const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
const { VaultClient } = require(path.join(__dirname, "vault.js"));
const keycloak = require(path.join(__dirname, "..", "keycloak.js"));

const getDBInfo = async () => {
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

const createDBConnection = async () =>{
    const dbinfo = await getDBInfo();
    //Connect to the Database
    const connection = mysql.createConnection({
        host: 'localhost',
        user: dbinfo.data.user,
        password: dbinfo.data.password,
        database: dbinfo.data.database
    });

    return connection;
}

const createTablesIfNeeded = async () => {
    try {
        const connection = await createDBConnection();

        const createTablesCode = fs.readFileSync(path.join(__dirname, "tables.sql")).toString();
        const splitStatements = createTablesCode.split(";").filter(Boolean);
        console.log(splitStatements);
        splitStatements.forEach((sql) => {
            connection.query(sql.trim(), (e, results) => {
                if (e) {
                    console.error(e);
                } else {
                    console.log(`SQL Success: ${sql.trim()}`)
                }
            });
        });

    } catch (e) {
        console.error(e);
    }

}

router.post("/login",keycloak.protect(), async (req, res) => {
    const connection = await createDBConnection();

    //Sets up the query for seeing if the user exists in the db.
    //Auth is done through keycloak - so there's no real registration process. 
    //However, logging in should allow users to customise their feed, so we store their user ID.
    const firstQuery = `SELECT * FROM accounts WHERE userID = ?`;
    const sub = [req.kauth.grant.access_token.content.sub];

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

module.exports = {router: router, createTablesIfNeeded: createTablesIfNeeded, createDBConnection: createDBConnection}