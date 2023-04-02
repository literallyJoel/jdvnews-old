import { useKeycloak } from "@react-keycloak/web";
import { DropdownButton, Dropdown } from "react-bootstrap";
import "./Nav.css";


//This is the dropdown button that shows when the user is logged in. In it's own file for neatness.
const LogoutButton = () =>{
    const { keycloak, initialized } = useKeycloak();


    return(
        <DropdownButton id="navbutton" title={keycloak.tokenParsed.name}>
    
            <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
            <Dropdown.Item onClick={() => keycloak.logout()}>Logout</Dropdown.Item>
        </DropdownButton>
    )
}

export default LogoutButton;