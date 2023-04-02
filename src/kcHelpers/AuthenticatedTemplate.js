import { useKeycloak } from "@react-keycloak/web";

const AuthenticatedTemplate = ({children}) =>{
    const { keycloak } = useKeycloak();

    const authenticated = keycloak.authenticated;

    return authenticated? children: null;
}

export default AuthenticatedTemplate;