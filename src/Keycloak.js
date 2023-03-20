import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: "https://cloak.jdvivian.co.uk/auth",
    realm: "JDVSite",
    clientId: "news.jdvivian.co.uk"
});

export default keycloak;