import React, { useEffect } from 'react';
import { useState } from 'react';

import './App.css';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import {db,auth} from "./firebase_file";
import Login from "./Login";
import Content from "./Content";
import Debug from "./Debug";
import { selectSports, setLeagues, setSports, setUsers,setCoins } from './features/counterSlice';
import { useDispatch, useSelector } from 'react-redux';

function App() {

  
  const dispatch=useDispatch();
  const load_sports=async()=>{
    
    const res=await db.collection("psg_sports").get();
    const sports=[];
    res.forEach((line)=>{
      var key=line.id;
      var sport=line.data();
      sport.key=key;
      console.log("we got",sport);
      sports.push(sport);
    })
    
    dispatch(setSports(sports));

    const res_leagues=await db.collection("psg_leagues").get();
    const leagues=[];
    res_leagues.forEach((line)=>{
      var key=line.id;
      var league=line.data();
      league.key=key;
      leagues.push(league);
    })
    dispatch(setLeagues(leagues));

    const res2=await db.collection("psg_users").get();
    const users=[];
    await res2.forEach((line)=>{
      var key=line.id;
      var user=line.data();
      var date=new Date(user.date.seconds*1000).toString();
      console.log(date);
      date=date.split(" ");
      const new_date=date[1]+" "+date[2]+" "+date[3];
      user.date=new_date;
      user.new_date=new_date;
      user.key=key;
      users.push(user);
    })
    dispatch(setUsers(users));
	const coins=[];
	
	await users.map(async (user,index)=>{
		const email=user.email;
		const res_coin=await db.collection("psg_users_coins").where("user","==",email).get();
		let total_coins=50;
		await res_coin.forEach((line)=>{
			const id=line.id;
			const coin=parseInt(line.data().entry);
			total_coins+=coin;
			
		});
		const obj={user:email,coins:total_coins};
		coins.push(obj);
		if(index==users.length-1){
			//dispatch(setCoins(coins));
		}
		
		
	});
	
	
	
    setApp(2);
    
    
  }

  //load_sports();

  useEffect(()=>{
    db.collection("psg_users_coins").onSnapshot((snap)=>{
      const data=[];
      snap.docs.map((doc)=>{
        const id=doc.id;
        const d=doc.data();
        d.key=id;
        data.push(d);
      })
      dispatch(setCoins(data))
    })
  },[])
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      if(user==null){
        //Login
        setApp(1);
      }else{
        //app
       // setApp(2);
        load_sports();
        
      }
    })
  },[auth,dispatch])

  const [app,setApp]=useState(0);
  return (
    <div>
      {
        app==0 ? <div className="loading">
          <HourglassEmptyIcon style={{color:"white"}} />
          Loading...</div> : 
        app==1 ? <Login /> : <><Content /></>
      }
    </div>
  );
}

export default App;
