const express = require("express");
const router = express.Router();
const Parser = require("rss-parser");
const parser = new Parser();
const path = require("path");
const keycloak = require(path.join(__dirname, "..", "keycloak.js"));
const { createDBConnection } = require("./database");

//This is for getting a users RSS feeds
router.get("/getRSS", keycloak.protect(), async (req, res) => {
    const connection = await createDBConnection();

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


router.get("/removeRSS", keycloak.protect(), async (req, res) => {
    const connection = await createDBConnection();

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




//This is for parsing RSS feeds
router.post('/parse-feeds', async (req, res) => {
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

module.exports = router;