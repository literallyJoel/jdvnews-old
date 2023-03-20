import "./Home.css"
import { Container } from "react-bootstrap";
import { useKeycloak } from "@react-keycloak/web";
import AuthenticatedFeed from "./AuthenticatedFeed";
import UnauthenticatedFeed from "./UnauthenticatedFeed";
const Home = () => {
    const { keycloak } = useKeycloak();
    
    //If the user is not logged in it gives a little prompt at the top encouraging it.
    const LoginBox = () => {
        if (!   keycloak.authenticated) {
            return (
                <div id="loginBox">
                    Log in to personalise your feed, and get an AI overview of your news.
                </div>
            )
        }
    }

    
    //Checks if the user is authenticated and if they aren't, it shows a generic news feed, else shows their customised one.
    return (
        <Container>
            <div className="headerText">Today's News</div>
            <LoginBox />

            <Container>
                {keycloak.authenticated? <AuthenticatedFeed/> : <UnauthenticatedFeed/>}
            </Container>
        </Container>
    )
}

export default Home;