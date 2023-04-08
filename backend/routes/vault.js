const Vault = require("node-vault");


//Vault role ID
const roleId = "d602bc2c-d71f-e592-bc6a-5380850146d4"
//Vault unwrap token
const unwrapToken = process.argv[2];

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

   

        const tokenRefreshInterval = setInterval(renewVaultAuth, 1800000);
    } catch (e) {
        console.error(`Vault Authentication Failed: ${e}`);
        return (e);
    }
}


async function renewVaultAuth() {
    //renew the token
    const result = await VaultClient.tokenRenewSelf();
    VaultClient.token = result.auth.client_token;
    console.log("Token Renewed");
}


module.exports = {VaultClient: VaultClient, vaultAuth: vaultAuth};

