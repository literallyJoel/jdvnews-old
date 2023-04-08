const express = require("express");
const router = express.Router();
const path = require("path");
const { VaultClient } = require(path.join(__dirname, "vault.js"));
const keycloak = require(path.join(__dirname, "..", "keycloak.js"));

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

router.post("/getSummary", keycloak.protect(), async (req, res) => {
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
});

module.exports = router;

