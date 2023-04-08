const Keycloak = require("keycloak-connect");

const keycloak = new Keycloak({
    clientId: "news.jdvivian.co.uk",
    bearerOnly: "true",
    serverURL: "https://cloak.jdvivian.co.uk",
    realm: "JDVSite"

});

module.exports = keycloak;