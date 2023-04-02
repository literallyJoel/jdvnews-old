import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import keycloak from './Keycloak';
import { ReactKeycloakProvider } from "@react-keycloak/web";
import "bootstrap/dist/css/bootstrap.min.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from './pages/Error/ErrorPage';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import FeedEditor from './pages/Profile/Pages/FeedEditor/FeedEditor';
import FeedView from './pages/Profile/Pages/FeedEditor/Components/FeedView';

//This controls routing for the app.
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage/>,
    children:[
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/profile",
        element: <Profile/>
      },
      {
        path: "/profile/feeds",
        element: <FeedEditor/>,
        children:[
          {
            path: "id/:feedID",
            element: <FeedView/>
          }
        ]
      }
    ]
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ReactKeycloakProvider authClient={keycloak}>
    <RouterProvider router={router} />
  </ReactKeycloakProvider>

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
