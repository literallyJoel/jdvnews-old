import { useKeycloak } from "@react-keycloak/web";

const UnauthenticatedTemplate = ({children}) =>{
    const { keycloak } = useKeycloak();

    const authenticated = keycloak.authenticated;

    return authenticated? null:children;
}

export default UnauthenticatedTemplate;