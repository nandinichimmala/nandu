import { useState } from "react";
function Toggle()
{
    const[show,setShow]=useState(false);
    return(
        <div>
            <button onClick={()=>setShow(!show)}>

            </button>
            {show && <h1>Hello Nandini</h1>}
        </div>
    )
}
export default Toggle;