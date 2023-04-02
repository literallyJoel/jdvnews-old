import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import AuthenticatedTemplate from "../../kcHelpers/AuthenticatedTemplate";
import UnauthenticatedTemplate from "../../kcHelpers/UnauthenticatedTemplate";
import { Button, Col, Container, Placeholder, Row, Table } from "react-bootstrap";

import "./Profile.css";
import { getFeeds } from "../../helpers/Helper";

const Profile = () => {
    const { keycloak } = useKeycloak();
    const [token, setToken] = useState(null);
    const [feeds, setFeeds] = useState(null);

    useEffect(() => {
        setToken(keycloak.token);

        async function getRSS() {
            if (keycloak.token !== undefined) {
                const userFeeds = await getFeeds(keycloak.token);
                setFeeds(userFeeds);
            }
        }

        getRSS();
    }, [keycloak.token])


    return (
        <>
            <AuthenticatedTemplate>
                {keycloak.tokenParsed ? (
                    <>
                        <div id="userName">Hi, {keycloak.tokenParsed.name}!</div>
                        <Row>

                            <div id="rssFeeds">
                                <div id="rssTitle">Your RSS Feeds</div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Link</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feeds !== null ? (feeds.map((feed) => (
                                            <tr>
                                                <td>{feed.FeedFriendlyName}</td>
                                                <td>{feed.FeedLink}</td>
                                            </tr>
                                        ))) : (
                                            <tr>
                                                 <td><Placeholder animation="glow"><Placeholder xs={5} /></Placeholder></td>
                                                 <td><Placeholder animation="glow"><Placeholder xs={12} /></Placeholder></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                                <div id="feedButtons"><Button id="feedButton"  href="/profile/feeds">Edit Feeds</Button></div>
                            </div>

                        </Row>


                    </>
                ) : (
                    <div>Loading...</div>
                )}

            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                You are not logged in. Please log in to view your profile.
            </UnauthenticatedTemplate>

        </>



    )
}





export default Profile;