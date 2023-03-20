import "./Home.css"
import { Container } from "react-bootstrap";
import { useKeycloak } from "@react-keycloak/web";
import AuthenticatedFeed from "./AuthenticatedFeed";
import UnauthenticatedFeed from "./UnauthenticatedFeed";
const Home = () => {
    const { keycloak } = useKeycloak();

    const LoginBox = () => {
        if (!   keycloak.authenticated) {
            return (
                <div id="loginBox">
                    Log in to personalise your feed, and get an AI overview of your news.
                </div>
            )
        }
    }

    

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