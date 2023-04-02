//I've gotta call the auth endpoint on a lot of different pages so I've put in here so I can import.

export async function Authorise(token){
    const res = await fetch("/auth/authorise", {
        method: "POST",
        headers:{
            "authorization": `bearer ${token}`
        }
    });

    if(res.status === 200){
        return true;
    }else{
        return false;
    }
}