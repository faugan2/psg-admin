import "../styles/spring.scss";
import {animated,useTransition} from "react-spring"
import {useState} from "react";

const SpringItem=({text})=>{
    const [show,set_show]=useState([1])
    const transition=useTransition(show,{
        from:{
            x:0,
            y:200,
            opacity:0,
        },
        enter:item=>async (next)=>{
            await next({y:0,x:10,opacity:1,delay:200})
            await next({y:0,x:0,opacity:1})
        }
        ,
        leave:{
            x:0,
            y:200,
            opacity:0
        }
    });

    return(
        transition((style,item)=>{
            if(item){
                return (
                <animated.div className="btn" style={style} onClick={e=>{
                    set_show([]);
                }}>
                {text}
            </animated.div>)
            }
        })
        
    )
}

export default SpringItem;