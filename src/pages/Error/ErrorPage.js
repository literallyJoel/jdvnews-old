import { useRouteError } from "react-router-dom";
import logoSmall from "../../assets/img/jdvdark.png";
import "./ErrorPage.css";
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="errorPage">
      <div id="errorContent">
        <img src={logoSmall} alt="Computacenter Logo Small" />
        <div id="mainText">Oh dear...</div>
        <div id="subtext">Sorry, something's gone wrong.</div>
        <div id="errorText"> <i> {error.status}: {error.statusText || error.message}</i> </div>
      </div>
    </div>

  );
}