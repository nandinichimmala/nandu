import {useState} from "react";
function LoginControl()
{
    const[isLoggedIn,setIsLoggedIn]=useState(false);

return(
    <div>
        {isLoggedIn?(
            <button onClick={()=>setIsLoggedIn(false)}>
                LogOut
            </button>
        ):(
        <button onClick={()=> setIsLoggedIn(true)}>Login</button>

        )}
      
    </div>
);
}

export default LoginControl;