import Keycloak from "keycloak-js";
//Sets up keycloak with my Keycloak domain
const keycloak = new Keycloak({
    url: "https://cloak.jdvivian.co.uk/auth",
    realm: "JDVSite",
    clientId: "news.jdvivian.co.uk"
});

export default keycloak;