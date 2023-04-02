import { Alert, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteFeed, getFeeds } from "../../../../../helpers/Helper";
import { useKeycloak } from "@react-keycloak/web";

const FeedView = () => {
    const { feedID } = useParams()
    const [selectedFeed, setSelectedFeed] = useState()
    //Stores the form data
    const [feedFriendlyName, setFeedFriendlyName] = useState("");
    const [feedLink, setFeedLink] = useState("");

    //Controls showing the various alerts
    const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
    const [showDeleteFailureAlert, setShowDeleteFailureAlert] = useState(false);
    const [showUpdateFailureAlert, setShowUpdateFailureAlert] = useState(false);
    const [showUpdateSuccessAlert, setShowUpdateSuccessAlert] = useState(false);

    const { keycloak } = useKeycloak();

    useEffect(() => {
        async function getFeed() {
            if (keycloak.token !== undefined) {
                const feed = await getFeeds(keycloak.token, feedID);
                setSelectedFeed(feed[0]);
                setFeedFriendlyName(feed[0].FeedFriendlyName);
                setFeedLink(feed[0].FeedLink);
            }
        }

        getFeed();
    }, [feedID, keycloak.id]);

    const removeFeed = () => {
        const deleted = deleteFeed(keycloak.token, feedID);
        if (deleted === 1) {
            setShowDeleteSuccessAlert(true);
            const timeout = setTimeout(() => {
                setShowDeleteSuccessAlert(false);
            }, 10000)

            window.location.replace("/profile/feeds")
            return () => clearTimeout(timeout);
        } else {
            setShowDeleteFailureAlert(true);
            const timeout = setTimeout(() => {
                setShowDeleteFailureAlert(true);
            }, 10000);

            return () => clearTimeout(timeout);
        }
    }

    const updateFeed = () => {

    }

    const DeleteSuccessAlert = () => {
        return (
            <Alert variant="success" id="DeleteSuccessAlert" show={showDeleteSuccessAlert} onClose={() => setShowDeleteSuccessAlert(false)}>
                <Alert.Heading>Feed Successfully Deleted</Alert.Heading>
            </Alert>
        )
    }


    const DeleteErrorAlert = () => {
        return (
            <Alert variant="danger" id="DeleteFailureAlert" show={showDeleteFailureAlert} onClose={() => setShowDeleteFailureAlert(false)}>
                <Alert.Heading>There was an issue deleting your feed</Alert.Heading>
            </Alert>
        )

    }

    return (
        <>
            <DeleteSuccessAlert />
            <DeleteErrorAlert />
            <Form id="feedForm">
                <Form.Group className="mb-3" >
                    <Form.Label>Feed Display Name</Form.Label>
                    <Form.Control type="text" id="formFeedFriendlyName" value={feedFriendlyName} onChange={(e) => setFeedFriendlyName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Feed Link</Form.Label>
                    <Form.Control type="text" id="formFeedLink" value={feedLink} onChange={(e) => setFeedLink(e.target.value)} />
                </Form.Group>
            </Form>

            <div id="formButtons">
                <Button id="updateButton">Update Feed</Button>
                <Button id="deleteButton" onClick={() => removeFeed()}>Remove this Feed</Button>
            </div>
        </>

    )
}

export default FeedView;