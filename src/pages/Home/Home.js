import "./Home.css"
import { Container } from "react-bootstrap";
import { useKeycloak } from "@react-keycloak/web";
import RSSFeed from "./Components/RSSFeed";
import {BsGithub}  from "react-icons/bs";
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
        <div>
            <div className="headerText">Today's News</div>
            <LoginBox />

            <Container>
                <RSSFeed />
            </Container>

            <div id="gitcalloutHome"><a href="https://github.com/literallyJoel/jdvnews"><BsGithub />View this project on GitHub</a></div>
        </div>
    )
}

export default Home;