import {useSpring,animated,useTransition} from "react-spring";
import {useState} from "react";
import SpringItem from "./SpringItem";

const Spring=()=>{
    const [visible,set_visible]=useState(true)
    const [items,set_items]=useState([])
    
    return(
        <div style={{border:"1px solid red",minHeight:"50vh"}}>
            <button
            onClick={e=>{
                set_items([...items,Math.round(Math.random()*50)])
            }}
            >Toggle</button>
           {
               
               items.map((i)=>{
                   return (
                       <SpringItem text={i} key={i}   />
                   )
               })
               
              
           }
        </div>
    )
}

export default Spring;