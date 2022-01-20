import Players from "./Players";
import Sports from "./Sports";
import Challenge from "./Challenge";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPage, setUser } from "./features/counterSlice";

const Main=()=>{
    const i=useSelector(selectPage);
    const [page,setIndex]=useState(i);
    const dispatch=useDispatch();

    useEffect(()=>{
        setIndex(i);
    })

    const handle_close_modal=()=>{
        //alert("ok closing");
          var modals=document.querySelectorAll(".modal");
          for(var i=0; i<modals.length; i++){
              modals[i].style.display="none";
          }
         // dispatch(setUser(null));

      }
      useEffect(()=>{
          var modals=document.querySelectorAll(".close");
          for(var i=0; i<modals.length; i++){
              var modal=modals[i];
              modal.addEventListener("click",handle_close_modal);
          }        
      },[])

    return(
        <div className="main">
            {
                page==0 ? <Players /> : 
                page==1 ? <Sports /> :
                page==2 ?  <Challenge /> : <div className="loading">Loading...</div>
            }
        
        </div>
    );
}
export default Main;