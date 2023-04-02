import { useState, useEffect } from "react";
import { Authorise } from "../../authHelper";

export function Profile(props){
    useEffect(() =>{
        async function checkAuth(){
            const auth = await Authorise(token);
            console.log(auth);
            if(!auth){
                localStorage.removeItem("token");
                props.setToken(undefined);
                window.location.replace("/login");

            }
        }

        const token = localStorage.getItem("token");
        if(token === null){
            window.location.replace("/login");
        }else{
        checkAuth();
        }
        
    }, []);

}

