import { useKeycloak } from "@react-keycloak/web";
import { DropdownButton, Dropdown } from "react-bootstrap";
import "./Nav.css";

const LogoutButton = () =>{
    const { keycloak, initialized } = useKeycloak();


    return(
        <DropdownButton id="navbutton" title={keycloak.tokenParsed.name}>
    
            <Dropdown.Item>My Profile</Dropdown.Item>
            <Dropdown.Item onClick={() => keycloak.logout()}>Logout</Dropdown.Item>
        </DropdownButton>
    )
}

export default LogoutButton;