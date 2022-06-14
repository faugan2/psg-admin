import React from 'react'
import { useEffect } from 'react'
import {db} from "./firebase_file";

export default function Debug() {
    useEffect(()=>{
       /*db.collection("psg_challenges").where("parent","==",false).get().then((snap)=>{
        snap.docs.map(async (doc)=>{
            const key=doc.id;
            await db.collection("psg_challenges").doc(key).delete();
            console.log("challenge",key,"deleted")
        })
       })*/
    },[])
  return (
    <div>Debug</div>
  )
}
