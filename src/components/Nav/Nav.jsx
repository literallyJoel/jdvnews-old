import { useKeycloak } from "@react-keycloak/web";
import { Navbar, Container } from "react-bootstrap";
import jdvlight from "../../assets/img/jdvlight.png"
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import "./Nav.css";

const Nav = () => {
  //Used so we can see if the user is logged in
  const { keycloak } = useKeycloak();

  //Returns the navbar, checks if the user is logged in or not and shows the appropriate button.
  return (
    <Navbar id="navbar" variant="dark" expand="md">
      <Container>
        <Navbar.Brand>
          <div className="d-flex align-items-center">
            <a href="/" style={{color: "white", textDecoration: "none"}}>
              <img
                alt=""
                src={jdvlight}
                width="30"
                height="30"
                className="d-inline-block align-top mr-2"
              />
              <span className="h5 mb-0">JDVNews</span>
            </a>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Container className="d-flex justify-content-end">
            {keycloak.authenticated ? <LogoutButton /> : <LoginButton />}
          </Container>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Nav;