import { useKeycloak } from "@react-keycloak/web";
import { Button } from "react-bootstrap";

const LoginButton = () =>{
    const { keycloak, initialized } = useKeycloak();


    return(
        <Button id="navbutton" onClick={() => keycloak.login()}>Login</Button>
    )
}

export default LoginButton;