import { useKeycloak } from "@react-keycloak/web";
import { Button } from "react-bootstrap";

//This is the login button that shows when the user is not logged in. Moved into it's own file for neatness.
const LoginButton = () =>{
    const { keycloak, initialized } = useKeycloak();


    return(
        <Button id="navbutton" onClick={() => keycloak.login()}>Login</Button>
    )
}

export default LoginButton;