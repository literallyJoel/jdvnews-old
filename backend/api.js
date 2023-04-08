const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const database = require(path.join(__dirname, "routes", "database.js")).router;
const { vaultAuth } = require(path.join(__dirname, "routes", "vault.js"));
const openai = require(path.join(__dirname, "routes", "openai.js"));
const rss = require(path.join(__dirname, "routes", "rss.js"));
const keycloak = require(path.join(__dirname, "keycloak.js"));
const { createTablesIfNeeded } = require(path.join(__dirname, "routes", "database.js"));

//Makes sure unwrap token provided. If not alerts and closes the server.
if (!process.argv[2]) {
    console.error("Please provide a wrap token as an argument")
    process.exit(1);
}



vaultAuth().then(() => {
    createTablesIfNeeded();
});

router.use(keycloak.middleware());

router.use(bodyParser.json());

router.use("/database", database);
router.use("/openai", openai);
router.use("/rss", rss);






module.exports = router


