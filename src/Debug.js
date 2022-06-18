import React from 'react'
import { useEffect } from 'react'
import {db} from "./firebase_file";
const moment =require("moment");

export default function Debug() {
    useEffect(()=>{
       db.collection("psg_challenges").where("parent","==",false).get().then((snap)=>{
        const data=[];
        snap.docs.map(async (doc,i)=>{
            const key=doc.id;
            const name=doc.data().name;
            const mode=doc.data().mode;
            const date=moment(doc.data().date?.seconds*1000).format("ll")
            if(date=="Jun 17, 2022"){
              data.push({key,name,mode,date})
            }
            
            
            //console.log("challenge",i,key,name,mode)
        })
        console.table(data);
       })

       db.collection("psg_picks").get().then((snap)=>{
        const data2=[];
        snap.docs.map((doc)=>{
          const key=doc.id;
          const id_challenge=doc.data().id_challenge;
          const date=moment(doc.data().date?.seconds*1000).format("ll");
          if(date=="Jun 17, 2022"){
            data2.push({key,id_challenge,date})
          }
        })
        console.table(data2);
       })
    },[])

    
  return (
    <div>Debug</div>
  )
}
