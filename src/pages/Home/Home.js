import "./Home.css"
import { Container } from "react-bootstrap";
import { useKeycloak } from "@react-keycloak/web";
import RSSFeed from "./Components/RSSFeed";
const Home = () => {
    const { keycloak } = useKeycloak();

    //If the user is not logged in it gives a little prompt at the top encouraging it.
    const LoginBox = () => {
        if (!keycloak.authenticated) {
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
                <RSSFeed />
            </Container>
        </Container>
    )
}

export default Home;