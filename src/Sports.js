import SearchIcon from '@material-ui/icons/Search';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLeagues, selectSelectedGame, selectSelectedGames, 
    selectChallenges,
    selectSports, setSelectedGame, setSelectedGames } from './features/counterSlice';
import DeleteIcon from '@material-ui/icons/Delete';
import DateRangeIcon from '@material-ui/icons/DateRange';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import TitleIcon from '@material-ui/icons/Title';
import { db } from './firebase_file';
import {data} from "./data";
import firebase from "firebase";
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import { calculate_pick_win, get_winners } from './functions';
import Modal from "./components/Modal";
import CreateGame from "./components/CreateGame";
import VisibilityIcon from '@material-ui/icons/Visibility';

//const API_KEY="008f86d3083f1d90c3a06ec1fe38032a"; foganbidi2@gmail.com
//const API_KEY="23c219dd52bfbe431d8f7320d8e53c00"; // sicitg2021@gmail.com
const API_KEY="d828cb8f0e4c810d597dbe0380a73c2b"; // real
const API_URL="https://api.the-odds-api.com/v4/sports/";
const moment=require("moment-timezone");



const Sports=()=>{
    const [sports,setAllSport]=useState([]); 
    const [leagues,setAllLeagues]=useState([]);
    const [showLeagues,setShowLeagues]=useState([]);
    const [id_sport,setId_sport]=useState("");
    const [id_league,setId_league]=useState("");
    const [games,setAll_games]=useState([]);
    const [selected_game,setSelected_game]=useState(null);
    
    const [start_date,setStart_date]=useState("");
    const [start_time,setStart_time]=useState("");
    const [total,setTotal]=useState("");
    
    const [v_ml,setV_ml]=useState("");
    const [v_spread,setV_spread]=useState("");
    const [over,setOver]=useState("");
    const [v_score,setV_score]=useState("");

    const [h_ml,setH_ml]=useState("");
    const [h_spread,setH_spread]=useState("");
    const [under,setUnder]=useState("");
    const [h_score,setH_score]=useState("");
    
    
    const [search,setSearch]=useState("");

    const [default_spread,setDefault_spread]=useState("");
    const [default_total,setDefault_total]=useState("");
    const [default_over_under,setDefault_over_under]=useState("");
    const [default_show,set_default_show]=useState("0");
    


    const s=useSelector(selectSports);
    const l=useSelector(selectLeagues);
    const sg=useSelector(selectSelectedGame);
    const sgs=useSelector(selectSelectedGames)
    const c=useSelector(selectChallenges);
    
    const [alerte,setAlerte]=useState("");
    const [challenges,set_challenges]=useState(null)

    const dispatch=useDispatch();

    useEffect(()=>{
        if(c==null) return;
        set_challenges(c);
    },[c])

    const handle_close_modal=()=>{
        //alert("ok closing");
          var modals=document.querySelectorAll(".modal");
          for(var i=0; i<modals.length; i++){
              modals[i].style.display="none";
          }
         // dispatch(setUser(null));

      }

      useEffect(()=>{
        if(sg==null) return;
        setSelected_game(sg);
      },[sg])
      useEffect(()=>{
          var modals=document.querySelectorAll(".close");
          for(var i=0; i<modals.length; i++){
              var modal=modals[i];
              modal.addEventListener("click",handle_close_modal);
          }        
      },[])

    useEffect(()=>{
        setAllSport(s);
    },[s]);

    useEffect(()=>{
        setAllLeagues(l);
    },[l]);


    useEffect(()=>{
        //const tmp_games=sgs;
        //search=search.toLocaleLowerCase();
        const new_games=sgs.filter((g)=>{
            return g.away.toLowerCase().indexOf(search.toLocaleLowerCase())>=0 ||
                   g.home.toLowerCase().indexOf(search.toLowerCase())>=0 ||
                   g.league.toLowerCase().indexOf(search.toLowerCase()) >=0 ||
                   g.start.toLowerCase().indexOf(search.toLowerCase()) >=0 ||
                   g.total.toString().toLowerCase().indexOf(search.toLowerCase()) >=0 ||
                   g.over.toString().toLowerCase().indexOf(search.toLowerCase()) >=0 ||
                   g.under.toString().toLowerCase().indexOf(search.toLowerCase()) >=0 ||
                   g.home_spread.toString().toLowerCase().indexOf(search.toLowerCase()) >=0 ||
                   g.away_spread.toLowerCase().indexOf(search.toLowerCase()) >=0 ||
                   g.away_moneyline.toString().toLowerCase().indexOf(search.toLowerCase()) >=0 ||
                   g.home_moneyline.toString().toLowerCase().indexOf(search.toLowerCase()) >=0 
        })
        if(search==""){
            setAll_games(sgs);
        }else{
            setAll_games(new_games);
        }
    },[search])

    useEffect(()=>{
        const tmp_sg=sg;
        console.log(tmp_sg);
        console.log("the game is ",sg);
        /*var  date=new Date(tmp_sg?.date.seconds*1000).toUTCString();
        date=date.split(" ");
        tmp_sg.new_date2="faugan";
        console.log(date);*/
        if(sg==null) return;

       
            setStart_date(sg.start_date);
            setStart_time(sg.start_time);
            setTotal(sg.total);
            setV_ml(sg.away_moneyline);
            setV_spread(sg.away_spread);
            setOver(sg.over);

            setH_ml(sg.home_moneyline);
            setH_spread(sg.home_spread);
            setUnder(sg.under);

            var as=sg.away_score;
            var hs=sg.home_score;
            if(as==undefined){
                as="";
            }
            if(hs==undefined){
                hs=""
            }
            setV_score(as);
            setH_score(hs)

        setSelected_game(tmp_sg)
    },[sg]);

    useEffect(async ()=>{
        if(id_league!=""){
            setDefault_total("");
           setDefault_over_under("");
           setDefault_spread("");
           set_default_show("0");
           setAlerte("Loading default values...");
           const res=await db.collection("psg_default_values").doc(id_league).get();
           
           const data=res.data();
           if(data===undefined){
            setAlerte("");
            return;
            }
           setDefault_total(data.default_total);
           setDefault_over_under(data.default_over_under);
           setDefault_spread(data.default_spread);
           set_default_show(data.default_show);

           setAlerte("");
        }
    },[id_league]);

    const load_leagues=(e)=>{
        setId_league("");
        var ids=e.target.value;
        setId_sport(ids);
        const tmp=leagues;
        const lg=tmp.filter((l2)=>{
            return l2.id_sport==ids;
        })
        console.log(lg);
        setShowLeagues(lg);
    }

    const load_games=async ()=>{
       if(id_sport==""){
           setAlerte("Please chose a sport");
           return;
       }
       if(id_league==""){
           setAlerte("Please chose a sport league");
           return;
       }
       setAlerte("Please wait...");

       const league_name=showLeagues.filter((l)=>{
           return l.id==id_league;
       })[0].name;
       
       db.collection("psg_games")
       .where("league","==",league_name)
       .orderBy("time","desc")
       .onSnapshot(async (snap)=>{
                const all_games=[];
                snap.docs.map((line)=>{
                const key=line.id;
                ///alert(key);
                const game=line.data();
                const dtt=game.date?.seconds;
                var date=new Date(dtt*1000).toUTCString();
                game.date=date;
                game.new_date=date;
                var datetime=game.start.split(" ");
                var dt=datetime[0]
                var time=datetime[1]
                game.key=key;
                game.start_date=dt;
                game.start_time=time;
                all_games.push(game);
            })
            setAll_games(all_games);
            dispatch(setSelectedGames(all_games));
            setAlerte("");
           /* console.log("getting challenges")
            const snap2=await db.collection("psg_challenges")
            .where("league","==",id_league)
            .get();
            
            const challenges=[];
            snap2.docs.map((doc)=>{
                console.log(doc.id);
                const id_challenge=doc.id;
                const entry=doc.data().entry;
                const mode_challenge=doc.data().mode;
                challenges.push({id_challenge,mode_challenge,entry});
            })*/

           /* challenges.forEach(async (challenge)=>{
                const key=challenge.id_challenge;
                const mode=challenge.mode_challenge;
                const entry=challenge.entry;
                
                const challenge_results=[];
                const snap3=await db.collection("psg_picks").where("id_challenge","==",key).get();
                let cpt=0;
                let total_doc=snap3.docs.length;
                snap3.docs.map(async (doc)=>{
                    
                    const id_pick=doc.id;
                    const user=doc.data().user;
                    const picks=doc.data().picks;
                    //console.log(picks);

                    const all_res=[];
                    const infos=[];
                    picks.forEach(async (pick)=>{
                        const id_game=pick.id_game;
                        const pickdata=pick.pickdata;
                        const team_picked=pick.team_picked;
                        const type_pick=pick.type_pick;
                        const rs=all_games.filter((item)=>{
                            return item.key==id_game;
                        })
                        let home_score="";
                        let away_score="";
                        if(rs.length>0){
                            home_score=rs[0]?.home_score;
                            away_score=rs[0]?.away_score;
                        }
                       // const obj={id_game,pickdata,team_picked,type_pick,home_score,away_score,mode}
                       const obj=pick;
                       console.log("the object is ",obj);
                       const {result,info}=  calculate_pick_win(obj);
                      // console.log("this is",result,type_pick);
                       all_res.push(result);
                       infos.push(info);
                       //console.log(res_win);
                       // console.log({id_game,pickdata,team_picked,type_pick,home_score,away_score,mode})
                    })
                    console.log("infos are ",{key,results:all_res,infos:infos});
                   
                    await db.collection("psg_picks").doc(id_pick).update({results:all_res,infos:infos},{merge:true});
                    cpt++;
                    challenge_results.push({user,mode,results:all_res});
                    
                    if(cpt==total_doc){
                        ///console.log("updating ",key);
                        const {wins,winners}=get_winners(challenge_results,mode);
                        await db.collection("psg_challenges").doc(key).update({challenge_results},{merge:true});
                        await db.collection("psg_challenges").doc(key).update({wins,winners},{merge:true});

                        const total_players=wins.length;
                        if(total_players<=1){
                            //cancel and turn back money to user
                           const coins_snap= await db.collection("psg_users_coins").where("id_challenge","==",key).get();
                           coins_snap.docs.map(async (doc)=>{
                               const doc_id=doc.id;
                                await db.collection("psg_users_coins").doc(doc_id).delete();
                           })
                           
                        }else{
                            //make reward
                            let reward=parseInt(entry)*(wins.length)/(winners.length);
                            if(reward==0){
                                reward=100;
                            }
                            winners.map(async (winner)=>{
                                console.log("a winner is ",winner);
                                const winner_email=winner.user;

                                const coins_snap= await db.collection("psg_users_coins")
                                .where("id_challenge","==",key)
                                .where("user","==",winner_email)
                                .get();

                                const total_lines=coins_snap.docs.length;
                                if(total_lines<=1){
                                    await db.collection("psg_users_coins").add({
                                        data:firebase.firestore.FieldValue.serverTimestamp(),
                                        entry:reward,
                                        id_challenge:key,
                                        picks:[],
                                        user:winner_email
                                    })
                                }
                            })
                           
                        }

                     
                    }
               
               
                })
                

                
            })*/

            
            
       });
       
    }

    const update_stats=async ()=>{

        // GET ALL GAMES WITH UNKNOWN SCORES
        const snap=await db.collection("psg_games")
        .where("away_score","==","")
        .where("home_score","==","")
        .get();
        const unfinished_games=snap.docs.map((doc)=>{
            return doc.id;
        })
       // console.log("the data unfished games are",unfinished_games)


        //GET ALL PLAYED CHALLENGE 
        const snap2=await db.collection("psg_challenges")
        .where("parent","==",false)
        .get();
        const challenges=snap2.docs.map((doc)=>{
            return doc.id;
        })
        console.log("the data all played challenged",challenges);

        // get picks for each challenges

        challenges.map(async (item,i)=>{
            const req=await db.collection("psg_picks").where("id_challenge","==",item).get()
            const picks=req.docs.map((doc)=>{
                const id_pick=doc.id;
                const pick=doc.data();
                pick.id_pick=id_pick;
                return {...pick}
            });
            //console.log("the data picks",picks)
            //get games for each picks of this challenge
            
            const games=[];
            picks.map((item2,i2)=>{
               const tmp_games= item2.picks.map((item3,i3)=>{  
                    games.push(item3.key);
                })
            })

            let diff=games.filter((x)=>{
                return unfinished_games.includes(x);
            })

            if(diff.length==0){
                // we can calculate stat for the challenge
                //picks,id_challenge;
               // calculate_stats(item,picks);
               calculate_stats(item,picks);
            }

            

            
            
           
        })

        
    }

    const calculate_stats=async (id_challenge,alluserspicks)=>{
        const res=await db.collection("psg_challenges").doc(id_challenge).get();
        const {type,mode,entry} = res.data();
        
        if(alluserspicks.length==1){
            //cancel this challenge
            //challenge.cancelled=true;
            return;
        }
        
        const stats=[];
        alluserspicks.map(async (item,i)=>{
            const {id_pick,picks,user}=item;

            const user_results=[];
             picks.map(async (pick,j)=>{
                const team_picked=pick.team;
                const type_pick=pick.type;
                const game_id=pick.key;
                const game=pick.game;

                //check if user win, lose, tie on this pick 
                // return 1 for win, 2 for lose, 3 for tie, 0 if no score found
                const res= check_pick_result(game_id,type_pick,team_picked,game);
                user_results.push(res);
                
                 
            })

            stats.push({id_pick,user,user_results});
            //console.log("the data",user,user_results);  
        })
        //console.log("the data whole stats is ",stats);
        const final_res=get_winners(mode,stats);
        

        //update the challenge and close it 
        await db.collection("psg_challenges")
        .doc(id_challenge)
        .update({...final_res,closed:true},{merge:true})
        console.log("the data, updated")
        
    }

    const get_winners=(mode,stats)=>{
        
        if(mode==1){
            //most wins; 
            let max_winnings=0; 
            const results=[];
            stats.map((item,i)=>{
                const {id_pick,user,user_results}=item;
                const wins=user_results.filter((item2,i2)=>{
                    return item2==1;
                }).length;

                if(wins>max_winnings){
                    max_winnings=wins;
                }

                const loses=user_results.filter((item2,i2)=>{
                    return item2==2;
                }).length;

                const ties=user_results.filter((item2,i2)=>{
                    return item2==3;
                }).length;
                results.push({id_pick,user,user_results,wins,loses,ties})
                
            })
            
            const winners=results.filter((item,i)=>{
                return item.wins==max_winnings;
            })
            
            return {results,max_winnings,winners};
           
        }
        if(mode==2){
            //longest winning streak 
            return [];
        }
    }

    const check_pick_result= (game_id,type_pick,team_picked,game)=>{
        const res=sgs.filter((item,i)=>{
            return item.key==game_id;
        })
       if(res.length==0) return 0;

       const {away_score,home_score}=res[0];
       
       if(type_pick==1){
        //moneyline 
        return  money_line_result(away_score,home_score,team_picked,game);
       }

       if(type_pick==2){
        return  spread_result(away_score,home_score,team_picked,game);
       }

       if(type_pick==3){
        return  total_result(away_score,home_score,team_picked,game);
       }

    }

    const money_line_result= (away_score,home_score,team_picked,game)=>{
        const as=parseFloat(away_score);
        const hs=parseFloat(home_score);

        if(team_picked==1){
            // picked away team 
            if(as>hs) return 1;
            if(as<hs) return 2; 
            if(as==hs) return 3;
        }

        if(team_picked==2){
            //picked home team;
            if(hs>as) return 1;
            if(hs<as) return 2; 
            if(hs==as) return 3;
        }
    }

    const spread_result= (away_score,home_score,team_picked,game)=>{
        console.log("the data spread")
    }

    const total_result= (away_score,home_score,team_picked,game)=>{
        const total=parseFloat(game.total);
        const s=parseFloat(away_score) + parseFloat(home_score);

        
        if(team_picked==1){
            //picked over 
            if(s>total) return 1;
            if(s<total) return 2;
            if(s==total) return 3;
        }

        if(team_picked==2){
            //picked under
            if(s<total) return 1;
            if(s>total) return 2;
            if(s==total) return 3;
        }
    }


    const league_changed=(e)=>{
        const idl=e.target.value;
        setId_league(idl);
    }

    const sport_click=(e,key)=>{
       // alert(e);
       console.log("here we go")
        e.stopPropagation();
        const modal=document.querySelector("#modal_sport_details");
        modal.style.display="block";

        const game=games.filter((line)=>{
            return line.key===key;
        });
        dispatch(setSelectedGame(game[0]));
        setSelected_game(game[0])
       
    }
    const delete_sport=async (key)=>{
       
       
        setAlerte("Please wait...");
        await db.collection("psg_games").doc(key).delete();

       const new_games=games.filter((game)=>{
           return game.key!=key;
       });
       setAll_games(new_games);
       setAlerte("");
    }

    const update_game=async (e)=>{
        var key=selected_game.key;
       var obj={
           start:start_date+" "+start_time,
           total,
           away_moneyline:v_ml,
           away_spread:v_spread,
           over,
           home_moneyline:h_ml,
           home_spread:h_spread,
           under,
           away_score:v_score,
           home_score:h_score
       }


       console.log("the new object is ",obj)
       setAlerte("Please wait...");
       e.target.disabled=true;

       await db.collection("psg_games").doc(key).update(obj,{merge:true});
       setAlerte("");
       e.target.disabled=false;
       update_stats();
    }

    const load_new_games=async (e)=>{
        setAlerte("Loading new games...");
        const current_league=leagues.filter((line)=>{
            return line.id==id_league;
        })[0];
        const sport_key=current_league?.sport_key;
        const league_name=current_league?.name;
        if(sport_key==undefined){
            setAlerte("You can not load this sport for now");
            return;
        }
        const timestamp=new Date().getTime();
        const url=API_URL+sport_key+"/odds/?apiKey="+API_KEY+"&regions=uk,us,eu,au&markets=h2h,spreads,totals&_="+timestamp+"&dateformat=iso";
        
        fetch(url).then((res)=>{
            return res.json();
        }).then((data)=>{
            
            const all_data=data;
            if(all_data!==undefined){
            var cpt=0;
			//console.log(all_data);
			//return;
            
           

            all_data.map(async  (game)=>{
                //console.log(game);
                const id_game=game.id;
                const away=game.away_team;
                const home=game.home_team;
                let time=game.commence_time;

                let local_date=moment.tz(time,tz).format();
                console.log(game.commence_time,local_date);

                const start=new Date(time);
                time=start.getTime();
                var day=start.getDate();
                var month=start.getMonth()+1;
                const year=start.getFullYear();
                var hour=start.getHours();
                var minute=start.getMinutes();

                if(month<10){
                    month="0"+month;
                }
                if(day<10){
                    day="0"+day;
                }
                if(hour<10){
                    hour="0"+hour;
                }
                if(minute<10){
                    minute="0"+minute;
                }

                const new_start=year+"-"+month+"-"+day+" "+hour+":"+minute;
                const sites=game.bookmakers;
               
                //console.log(sites);
                ///const sites_count=sites.sites_count;
                
                var away_spread="+"+default_spread;
                var home_spread="-"+default_spread;

                var away_moneyline="";
                var home_moneyline="";
                var home_score="";
                var away_score="";
                var away_abbr="";
                var home_abbr="";

                var over="+"+default_over_under;
                var under="-"+default_over_under;

                var total=default_total;

               // console.log(sites);

                
              
                if(sites.length>0){
                    //away_moneyline=sites[0].odds.h2h[0];
                   // home_moneyline=sites[0].odds.h2h[1];

                   let r=sites.filter((item)=>{
                       const total=item.markets.length;
                        return total>=3;
                   })
                   if(r.length==0){
                       console.log("the result is zero");
                       r=sites[0];
                   }
                   
                   const final=r[0];
                   const markets=final.markets;
                   markets.map((market)=>{
                       const market_key=market.key;
                       const market_odds=market.outcomes;
                       //console.log(market_key,market_odds);

                       if(market_key=="h2h"){
                            away_moneyline=market_odds.filter((m)=>{
                                return away==m.name;
                            })[0]?.price;

                            home_moneyline=market_odds.filter((m)=>{
                                return home==m.name;
                            })[0]?.price;
                       }

                       if(market_key=="spreads"){
                           console.log(market_odds)
                            away_spread=market_odds.filter((m)=>{
                                return away==m.name;
                            })[0]?.point;
                            

                            home_spread=market_odds.filter((m)=>{
                                return home==m.name;
                            })[0]?.point;

                            console.log(home_spread,away_spread);
                        }

                        if(market_key=="totals"){
                            over=market_odds.filter((m)=>{
                                return "Over"==m.name;
                            })[0]?.price;

                            under=market_odds.filter((m)=>{
                                return "Under"==m.name;
                            })[0]?.price;

                            total=market_odds.filter((m)=>{
                                return "Under"==m.name;
                            })[0]?.point;
                        }
                   
                })
                    
                }

                
                const obj={
                    start:new_start,
                    commence:game.commence_time,
                    away,
					time,
                    home,
                    away_moneyline,
                    home_moneyline,
                    away_spread,
                    home_spread,
                    league:league_name,
                    home_score,
                    away_score,
                    date:new firebase.firestore.FieldValue.serverTimestamp(),
                    home_abbr,
                    away_abbr,
                    over,
                    under,
                    total
                }


                const snap_ch=await db.collection("psg_games").doc(id_game).get();
                if(!snap_ch.exists){
                    await db.collection("psg_games").doc(id_game).set(obj,{merge:true})
                }

                
                cpt++;
                if(cpt==all_data.length){
                    setAlerte("");
                    load_games();
                }
               
            })
        }
        }).catch((err)=>{
            alert(err);
        });
       /* const all_data=data?.data;
        console.log("and the default ones are ",all_data)*/

        
       
    }

    const set_default_values=async (e)=>{
        setAlerte("Setting default values...");
       // alert(default_show);
       await db.collection("psg_default_values").doc(id_league)
       .set({default_spread,default_total,default_over_under,default_show})
       setAlerte("");
    }

    const switch_game=async (e,id_game)=>{
        e.stopPropagation();
        setAlerte("Please wait...");
        const req=await db.collection("psg_games").doc(id_game).get();
        const data=req.data();
        const home=data.home;
        const home_ml=data.home_moneyline;
        const home_spread=data.home_spread;

        const away=data.away;
        const away_ml=data.away_moneyline;
        const away_spread=data.away_spread;

        await db.collection("psg_games").doc(id_game).update({
            away:home,
            home:away,
            home_moneyline:away_ml,
            away_moneyline:home_ml,
            home_spread:away_spread,
            away_spread:home_spread
        },{merge:true});

        setAlerte("");
        
    }
	
	const [time_diff,set_time_diff]=useState("");
    const [tz,set_tz]=useState("");
	useEffect(()=>{
		const d = new Date();
		let diff = d.getTimezoneOffset();
		set_time_diff(diff);

       
        var zone_name =  moment.tz.guess();
        set_tz(zone_name);
		
	},[])

    const open_add_game=()=>{
       
        set_open_create(true)
    }

    const [open_create,set_open_create]=useState(false);
    
    return(
        <div className="sports">
            <div className="sports_header">
                <select onChange={load_leagues}>
                    <option value="">Chose a sport</option>
                    {
                        sports.map((sport)=>{
                            return(
                                <option value={sport.id} key={sport.key}>{sport.name}</option>
                            );
                        })
                    }
                </select>
                <select onChange={league_changed}>
                    <option value="">Chose a league</option>
                    {
                        showLeagues.map((league)=>{
                            return(
                                <option value={league.id} key={league.key}>{league.name}</option>
                            );
                        })
                    }
                </select>
                <button onClick={load_games}>View</button>
                <button onClick={load_new_games}>Load Games</button>
                <button 
                style={{backgroundColor:"indianred",color:"white"}}
                onClick={open_add_game}>Add a Game</button>
				{/*<button>{time_diff} {tz}</button>*/}
                
                {
                    showLeagues.length>0 && id_league !="" ? <div className="default_values">
                   
                    <div>
                        <div style={{display:"none"}}>
                            <p>Spread</p>
                            <input type="text" value={default_spread} onChange={(e)=>setDefault_spread(e.target.value)} />
                        </div>
                        <div style={{display:"none"}}>
                            <p>Total</p>
                            <input type="text" value={default_total} onChange={(e)=>setDefault_total(e.target.value)} />
                        </div>
                        <div style={{display:"none"}}>
                            <p>O-U</p>
                            <input type="text" value={default_over_under} onChange={(e)=>{setDefault_over_under(e.target.value)}} />
                        </div>
                        <div>
                            <p>Show</p>
                            <select onChange={(e)=>set_default_show(e.target.value)} 
                            value={default_show}>
                                <option value="0">All</option>
                                <option value="1">ML</option>
                                <option value="2" >Spread</option>
                            </select>
                        </div>
                        <button onClick={set_default_values}>Set</button>
                    </div>
                </div>:null
                }
                
                
            </div>
            <div className="sports_body">
            <p className="alerte">{alerte}</p>
            <div className="players__search_zone">
                <div>
                    <input type="search" placeholder="Search sports" value={search} onChange={(e)=>setSearch(e.target.value)} />
                    <SearchIcon style={{color:"white",fontSize:"1.2rem"}}/>
                </div>
            </div>
                <table  className="table_sports">
                    <thead>
                        <tr>
                            <th width="15%">Date</th>
                            <th>Visit</th>
                            <th>Home</th>
                            <th width="5%">Actions</th>
                        </tr>

                    </thead>
                    <tbody>
                        {
                            games.map((game)=>{
                                

                               let moment_date=moment.tz(game.commence,tz);
                               let local_date=moment_date.format("ll");
                               let local_time=moment_date.format("LT");

                               console.log(game.commence,local_date);
                                return(
                                    <tr key={game.key} >
                                        <td>{local_date} {local_time}</td>
                                        <td>{game.away}</td>
                                        <td>{game.home}</td>
                                        <td style={{display:"flex",alignItems:"center",gap:"1rem"}}>
                                           
                                           <button onClick={(e)=>{
                                        sport_click(e,game.key)
                                    }}>
                                               <VisibilityIcon />
                                           </button>

                                            <button onClick={e=>{
                                                    switch_game(e,game.key)
                                            }}>
                                            <SyncAltIcon />
                                            </button>
                                            <button title="Delete" onClick={delete_sport.bind(this,game.key)} data-id_game={game.key}>
                                                x
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className="modal" id="modal_sport_details">
                <div className="modal-content">
                <span className="close">&times;</span>
                    <div className="game_detail_content" >
                        <div className="game_detail_date">
                            <div>
                                <DateRangeIcon />
                                <input type="date" value={start_date} onChange={(e)=>{
                                    setStart_date(e.target.value);
                                }}/>
                            </div>

                            <div>
                                <QueryBuilderIcon />
                                <input type="time" value={start_time} onChange={(e)=>{
                                    setStart_time(e.target.value);
                                }}/>
                            </div>
                            <div>
                                <TitleIcon />
                                <input type="text"  value={total} onChange={(e)=>{
                                    setTotal(e.target.value);
                                }}/>
                            </div>
                            
                        </div>
                        <div className="game_detail_info">
                            <p>{selected_game?.away}</p>
                            <div>
                                <div>
                                    <p>MoneyLine</p>
                                    <input type="text" value={v_ml} onChange={(e)=>{
                                        setV_ml(e.target.value);
                                    }} />
                                </div>

                                <div>
                                    <p>Spread</p>
                                    <input type="text" value={v_spread} onChange={(e)=>{
                                        setV_spread(e.target.value);
                                    }}/>
                                </div>

                                <div>
                                    <p>Over</p>
                                    <input type="text" value={over} onChange={(e)=>{
                                        setOver(e.target.value);
                                    }} />
                                </div>

                                <div>
                                    <p>Score</p>
                                    <input type="text" value={v_score} onChange={(e)=>{
                                        setV_score(e.target.value);
                                    }}/>
                                </div>
                                
                                
                            </div>

                        </div>


                        <div className="game_detail_info">
                            <p>{selected_game?.home}</p>
                            <div>
                                <div>
                                    <p>MoneyLine</p>
                                    <input type="text" value={h_ml} onChange={(e)=>{
                                        setH_ml(e.target.value);
                                    }} />
                                </div>

                                <div>
                                    <p>Spread</p>
                                    <input type="text" value={h_spread} onChange={(e)=>{
                                        setH_spread(e.target.value);
                                    }} />
                                </div>

                                <div>
                                    <p>Under</p>
                                    <input type="text" value={under} onChange={e=>setUnder(e.target.value)} />
                                </div>

                                <div>
                                    <p>Score</p>
                                    <input type="text" value={h_score} onChange={e=>setH_score(e.target.value)}/>
                                </div>
                                
                                
                            </div>

                        </div>

                        <button onClick={update_game}>Update</button>
                        <p className="alerte">{alerte}</p>
                       
                    </div>
                </div>
            </div>


            {open_create==true && <Modal open_modal={true} content={<CreateGame />} />}

        </div>
    );
}
export default Sports;