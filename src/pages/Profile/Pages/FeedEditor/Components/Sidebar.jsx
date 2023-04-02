import "../FeedEditor.css";
import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

const Sidebar = (props) => {
    const { feedID } = useParams();
    return (
        <div id="sidebar">
            <div className="sidebarHeader">
                <Container>
                    <Row className="itemRow">
                        <b>Your RSS Feeds</b>
                    </Row>
                    <Row className="itemRow" style={{ fontSize: "0.7rem", color: "lightgrey" }}>
                        Select a feed below to modify
                    </Row>
                </Container>
            </div>

            {props.feeds ? (

                props.feeds.map((feed) => (

                    <div className={feedID == feed.FeedID? "sidebarItem Active" : "sidebarItem"} key={feed.feedID} >
                        <Link to={`/profile/feeds/id/${feed.FeedID}`}>
                            <Container>
                                <Row className="itemRow">
                                    {feed.FeedFriendlyName}
                                </Row>

                                <Row className="itemRow" style={{ fontSize: "0.5rem", color: "lightgrey" }}>
                                    {feed.FeedLink}
                                </Row>
                            </Container>
                        </Link>
                    </div>

                ))

            ) : (
                <>loading....</>
            )}
        </div >
    )
}

export default Sidebar;