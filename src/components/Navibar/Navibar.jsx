import { Button, DropdownButton, Navbar , Dropdown} from "react-bootstrap";
import logoLight from "../../assets/img/jdvlogo/logoLight.png";
import "./navibar.css";
import decode from "jwt-decode";

export const Navibar = (props) => {

    function Logout(){
        localStorage.removeItem("token");
        props.setToken(undefined);
        window.location.replace("/login");
    }
    function LoginButton() {
    

        if(props.token){
         
            return(
                <DropdownButton id="profileButton" title={decode(props.token).userName}>
                    <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                    <Dropdown.Item onClick={() => Logout()}>Logout</Dropdown.Item>
                </DropdownButton>
            )
        }else{
          
            return(
                <Button id="loginButton">Login</Button>
            )
        }

    }
    return (
        <Navbar id="navibar" variant="dark" className="justify-content-between">

            <div className="d-flex">
                <Navbar.Brand href="#home" style={{ marginLeft: "10vw" }}>
                    <img
                        alt=""
                        src={logoLight}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    JDVNews
                </Navbar.Brand>
            </div>

            <div className="d-flex justify-content-end" style={{ marginRight: "10vw" }}>
                <LoginButton/>
            </div>

        </Navbar>

    );
};
