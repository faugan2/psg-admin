import SearchIcon from '@material-ui/icons/Search';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectChallenges, selectLeagues, selectSports, setChallenges } from './features/counterSlice';
import { db,storage } from './firebase_file';
import EditIcon from '@material-ui/icons/Edit';
import firebase from "firebase";


const Challenge=()=>{
    const dispatch=useDispatch();
    const s=useSelector(selectSports);
    const l=useSelector(selectLeagues);
    const c=useSelector(selectChallenges);

    const [sports,setAllSports]=useState([]);
    const [leagues,setAllLeagues]=useState([]);
    const [show_leagues,setShowLeagues]=useState([]);
    const [alerte,setAlerte]=useState("")
    const [challenges,setAll_challenges]=useState([]);

    const [type,setType]=useState("");
    const [sport,setSport]=useState("");
    const [league,setLeague]=useState("");
    const [mode,setMode]=useState("");
    const [entry,setEntry]=useState("");
    const [number_game,setNumber_game]=useState("");
    const [name,setName]=useState("");

    const [search,setSearch]=useState("");

    const [selected_challenge_name,setSelected_challenge_name]=useState("");
    const [selected_challenge_key,setSelected_challenge_key]=useState("");

    useEffect(()=>{
        setAllSports(s);
    },[s])

    useEffect(()=>{
        setAllLeagues(l);
    },[l]);

    useEffect(()=>{
        setAll_challenges(c);
    },[c]);

    const sport_changed=(e)=>{
        var id_sport=e.target.value;
        setSport(id_sport);
        const all_leagues=leagues.filter((league)=>{
            return league.id_sport==id_sport;
        });
        setShowLeagues(all_leagues);
        search_challenge();
    }

    const handle_close_modal=()=>{
          var modals=document.querySelectorAll(".modal");
          for(var i=0; i<modals.length; i++){
              modals[i].style.display="none";
          }
          setAlerte("");
      }
      useEffect(()=>{
          var modals=document.querySelectorAll(".close");
          for(var i=0; i<modals.length; i++){
              var modal=modals[i];
              modal.addEventListener("click",handle_close_modal);
          }        
      },[])

      const open_create_challenge_form= ()=>{
          const modal=document.querySelector("#modal_create_challenge");
          modal.style.display="block";

          const zones=document.querySelectorAll("#modal_create_challenge >div > div");
          zones.forEach((zone)=>{
              zone.style.display="none";
          })
        
          if(type==""){
              setAlerte("Please set challenge type");
              return;
          }

          if(sport==""){
              setAlerte("Please chose a sport");
              return;
          }

          if(league==""){
              setAlerte("Please chose a league");
              return;
          }

          if(mode==""){
              setAlerte("Please chose a game mode");
              return;
          }

          if(entry==""){
              setAlerte("Please chose an entry");
              return;
          }

          setAlerte("");
          //zone.style.display="block";
          zones.forEach((zone)=>{
            zone.style.display="flex";
        })

          
      }

      const create_challenge=async(e)=>{
         if(number_game==""){
             setAlerte("The number of game is not set");
             return;
         }
         if(name==""){
             setAlerte("Please enter the name of the challenge");
             return;
         }

         setAlerte("Please wait...");
         const res=await  db.collection("psg_today").doc("date").get();
         const today=res.data().date.seconds;

         const obj={
             name,
             number_game,
             type,
             sport,
             league,
             mode,
             entry,
             z_data:[
                 {
                    date:today,
                    state:0,
                    picks:[]
                 }
             ],
             parent:true,
             date:firebase.firestore.FieldValue.serverTimestamp()
         }
        
       
        await  db.collection("psg_challenges").add(obj);
        setAlerte("Done");
        setNumber_game("");
        document.querySelector("#number_game").value="";
        setName("");
        load_challenges();
        setTimeout(()=>{
            setAlerte("");
        },3000)
      }
      const load_challenges=async (e)=>{
        const res= db.collection("psg_challenges").onSnapshot((snap)=>{
            const all_challenge=[];
            snap.docs.map((line)=>{
                const key=line.id;
                const challenge=line.data();
                challenge.key=key;
    
                all_challenge.push(challenge);
            })
            dispatch(setChallenges(all_challenge));
        })
        /*const all_challenge=[];
        res.forEach((line)=>{
            const key=line.id;
            const challenge=line.data();
            challenge.key=key;

            all_challenge.push(challenge);
        })
        */
        
      }

      useEffect(()=>{
          load_challenges();
      },[])

      const types=["","Mission","Heads Up","Sports Booth","Tournaments"];
      const modes=["","Most Wins","Long win str"];

      const delete_challenge=async (e,key)=>{
          setAlerte("Please wait...");

          await  db.collection("psg_challenges").doc(key).delete();
          setAlerte("");
          load_challenges();
      }

      const edit_challenge=(e,key,name)=>{
          const modal=document.querySelector("#modal_edit_challenge");
          modal.style.display="block";
          setAlerte("");
          setSelected_challenge_key(key);
          setSelected_challenge_name(name);
      }

      const edit_challenge_now=async (e)=>{
          setAlerte("Please wait...");
          await db.collection("psg_challenges").doc(selected_challenge_key).set({name:selected_challenge_name},{merge:true})
          document.querySelector("#modal_edit_challenge").style.display="none";
          setAlerte("");
          load_challenges();
    }

    const search_challenge= ()=>{
        console.log(c);
        var res=c;
        
        if(type!=""){
            res= res.filter((ch)=>{
                console.log(ch.type," and ",type);
                return ch.type==type;
            })
        }

        if(sport!=""){
            res=res.filter((challenge)=>{
                return challenge.sport==sport;
            })
        }

        if(league!=""){
            res=res.filter((challenge)=>{
                return challenge.league==league;
            })
        }

        if(mode!=""){
            res=res.filter((challenge)=>{
                return challenge.mode==mode;
            })
        }

        if(entry!=""){
            res=res.filter((challenge)=>{
                return challenge.entry==entry;
            })
        }

        if(search!=""){
            var str=search.toLowerCase();
            res=res.filter((challenge)=>{
                return  challenge.name.toLowerCase().indexOf(str)>=0;
            })
        }
        setAll_challenges(res);
        console.log(res);

    
    }
      
	const [ch_key,setCh_key]=useState("");
	  
	 const set_challenge_image=(e,key,name)=>{
		 const modal=document.querySelector("#modal_edit_challenge_img");
		 modal.style.display="block";
		 setCh_key(key);
	 }
	 
	 const challenge_pic_changed=async (e)=>{
		const files=e.target.files;
		const key=ch_key
		
		if(files.length>0){
			const file=files[0];
            console.log(file);
            setAlerte("Please wait...");
             var ref=storage.ref("challenges/"+file.name);
             ref.put(file).then((res)=>{
                ref.getDownloadURL().then(async (url)=>{
                    setAlerte("sending to db...");
                    await db.collection("psg_challenges").doc(key).update({url:url},{merge:true});
                    setAlerte("Done");
                }).catch((er)=>{
                    setAlerte(er.message);
                })
             }).catch((er)=>{
                 setAlerte(er.message);
             })
			//a.catwait db.collection("psg_challenges").doc(key).update()
		}
	 }

    return(
        <div className="challenges">
             <div className="challenges_search_zone">
                 
                 <div>
                     <div>
                     <select onChange={(e)=>{
                         setType(e.target.value);
                         //search_challenge();
                         
                     }}>
                            <option value="">Chose a challenge</option>
                            <option value="1">Missions</option>
                            <option value="2">Heads Up</option>
                            <option value="3">Sports Booth</option>
                            <option value="4">Tournaments</option>
                    </select>
                     </div>
                   
                    <div>
                    <select onChange={sport_changed}>
                        <option value="">Chose a sport</option>
                        {
                            sports.map((sport)=>{
                                return(
                                    <option value={sport.id} key={sport.key}>{sport.name}</option>
                                );
                            })
                        }
                    </select>
                    </div>
                    
                    <div>
                    <select onChange={(e)=>{
                        setLeague(e.target.value);
                        
                    }}>
                        <option value="">Chose a league</option>
                        {
                            show_leagues.map((league)=>{
                                return(
                                    <option value={league.id} key={league.key}>{league.name}</option>
                                );
                            })
                        }
                    </select>
                    </div>

                    <div>
                    <select onChange={(e)=>{
                        setMode(e.target.value);
                        
                    }}>
                        <option value="">Chose a game mode</option>
                        <option value="1">Most Wins</option>
                        <option value="2">Long Win Str</option>
                    </select>
                    </div>

                    <div>
                    <select onChange={(e)=>{
                        setEntry(e.target.value);
                       
                    }}>
                        <option value="">Chose an entry</option>
                        <option value="0">Free</option>
                        <option value="1000">1000 coins</option>
                        <option value="2000">2000 coins</option>
                        <option  value="5000">3000 coins</option>
                    </select>
                    </div>

                    <button onClick={(e)=>{
                        search_challenge();
                    }}>search</button>
                    
                    
                    
                   
                 </div>
                <div>
                    <input type="search" placeholder="Quick search" value={search} onChange={(e)=>{
                        setSearch(e.target.value);
                        //search_challenge();
                    }} 
                    onKeyUp={(e)=>{
                        search_challenge();
                    }}
                    />
                    <SearchIcon />
                </div>
            </div>

            <div className="challenges_body">

                <div className="challenges_body_actions">
                    <button onClick={open_create_challenge_form}>Create</button>
                    <p className="alerte">{alerte}</p>
                </div>
            <table  className="table_challenges">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Sport</th>
                            <th>League</th>
                            <th>Entry</th>
                            <th>Mode</th>
                            <th width="5%">Actions</th>
                        </tr>

                    </thead>
                    <tbody className="tbody_challenge">
                        {
                            challenges.map((challenge)=>{
                                const sport_name=s.filter((sport)=>{
                                    return sport.id==challenge.sport
                                })[0].name;

                                const league_name=l.filter((league)=>{
                                    return league.id==challenge.league;
                                })[0].name;
                                var entry=challenge.entry;
                                if(entry=="0"){
                                    entry="Free";
                                }
                                return(
                                    <tr key={challenge.key}>
                                        <td>{types[challenge.type]}</td>
                                        <td className="challenge_name_td">
                                            {challenge.name}
                                            <button onClick={(e)=>{
                                                edit_challenge(e,challenge.key,challenge.name);
                                            }}>
                                                <EditIcon />
                                            </button>
											
											<button onClick={(e)=>{
                                                set_challenge_image(e,challenge.key,challenge.name);
                                            }}>
                                                
                                                
                                                {challenge.url == "" && "Img"}
                                                {challenge.url != "" && 
                                                <img src={challenge.url} style={{
                                                    width:"40px",
                                                    height:"40px",
                                                    borderRadius:"50%",
                                                }}
                                                />
                                                }
                                            </button>
											
											
                                        </td>
                                        <td>{sport_name}</td>
                                        <td>{league_name}</td>
                                        <td>{entry}</td>
                                        <td>{modes[challenge.mode]}</td>
                                        <td>
                                            <button onClick={(e)=>{
                                                delete_challenge(e,challenge.key);
                                            }}>x</button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className="modal" id="modal_create_challenge">
                <div className="modal-content">
                <span className="close">&times;</span>
                    <div className="create_challenge_body" >
                       
                       <div>
                           <select onChange={(e)=>{
                               setNumber_game(e.target.value)
                           }} id="number_game">
                               <option value="">Nomber of game</option>
                               <option value="3">3</option>
                               <option value="3">5</option>
                               <option value="3">7</option>
                               <option value="3">9</option>
                           </select>
                       </div>

                       <div>
                           <input type="text" placeholder="Name" value={name} onChange={(e)=>{
                               setName(e.target.value)
                           }}  />
                       </div>
                       
                      
                       
                    </div>
                    <div>
                        <button onClick={create_challenge}>Submit</button>
                    </div>

                    <p className="alerte">{alerte}</p>
                    
                </div>
            </div>


            <div className="modal" id="modal_edit_challenge">
                <div className="modal-content">
                <span className="close">&times;</span>
                    <div className="edit_challenge_body" >
                        <div>
                            <input type="text" value={selected_challenge_name} id="challenge_img_input" onChange={(e)=>{
                                setSelected_challenge_name(e.target.value);
                            }} />
                        </div>
                        <button onClick={edit_challenge_now}>Update now</button>
                        <div className="alerte_zone">{alerte}</div>
                       
                    </div>
                </div>
            </div>
			
			
			<div className="modal" id="modal_edit_challenge_img">
                <div className="modal-content">
                <span className="close">&times;</span>
                    <div className="edit_challenge_body" >
                        <div>
                           <input type="file" onChange={challenge_pic_changed} />
                        </div>
                       
                        <div className="alerte_zone">{alerte}</div>
                       
                    </div>
                </div>
            </div>


        </div>
    );
}
export default Challenge;