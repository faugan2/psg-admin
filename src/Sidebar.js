import GroupIcon from '@material-ui/icons/Group';
import SportsIcon from '@material-ui/icons/Sports';
import ClosedCaptionIcon from '@material-ui/icons/ClosedCaption';
import TitleIcon from '@material-ui/icons/Title';
import MuseumIcon from '@material-ui/icons/Museum';
import { useDispatch } from 'react-redux';
import { setPage } from './features/counterSlice';
import { useEffect, useState } from 'react';
import {db} from "./firebase_file";
import firebase from "firebase";

import Spring from "./components/Spring";

const Sidebar=()=>{
    const dispatch=useDispatch();
    const [date,setDate]=useState("");
    const go_to_content=(index)=>{
        
        dispatch(setPage(index));
        const btns=document.querySelectorAll(".sidebar > button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })
        console.log(btns);
        btns[index].classList.add("active");
    }

    const set_today_date=async()=>{
        await db
            .collection("psg_today")
            .doc("date")
            .set({date:firebase.firestore.FieldValue.serverTimestamp()});

            get_today_date();
    }

    const get_today_date=async ()=>{
        const res=await db
                    .collection("psg_today")
                    .doc("date")
                    .get();
            var date=new Date(res.data()?.date.seconds*1000).toUTCString();
            setDate(date);
    }

   

    

    

    useEffect(()=>{
        get_today_date();
    },[])


    return(
        <div className="sidebar">
            
            <button onClick={go_to_content.bind(this,0)}>
                <GroupIcon />
                Players
            </button>

            <button onClick={go_to_content.bind(this,1)}>
                <SportsIcon />
                Sports
            </button>

            <button onClick={go_to_content.bind(this,2)}>
                <ClosedCaptionIcon />
                Challenges
            </button>

            

            <div className="zone_server_time">
                <h2>Server time</h2>
                <p>{date}</p>
                <button className="btn_server_time" onClick={set_today_date}>Update time</button>
            </div>

            {/*<Spring />*/}
            

            {/*<button onClick={go_to_content.bind(this,3)}>
                <TitleIcon />
                Tournaments
            </button>

            <button onClick={go_to_content.bind(this,4)}>
                <MuseumIcon />
                Missions
    </button>*/}
        </div>
    );
}

export default Sidebar;