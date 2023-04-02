import { useKeycloak } from "@react-keycloak/web";
import { useState, useEffect } from "react";
import AuthenticatedTemplate from "../../../../kcHelpers/AuthenticatedTemplate";
import UnauthenticatedTemplate from "../../../../kcHelpers/UnauthenticatedTemplate";
import Sidebar from "./Components/Sidebar";
import "./FeedEditor.css";
import { getFeeds } from "../../../../helpers/Helper";
import { Outlet } from "react-router-dom";


const FeedEditor = () => {
    const { keycloak } = useKeycloak();
    const [feeds, setFeeds] = useState(null);

    useEffect(() => {
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
                {feeds?  <Sidebar feeds={feeds} /> :<></>}
                <div id="feedView">
                <Outlet/>
                </div>
                
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                Please sign in to customise your feeds.
            </UnauthenticatedTemplate>
        </>
    )
}


export default FeedEditor