import SearchIcon from '@material-ui/icons/Search';
import PersonIcon from '@material-ui/icons/Person';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import { useEffect, useState } from 'react';
import {db} from "./firebase_file";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import PlayerInfo from "./PlayerInfo";
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectUsers, setUser,selectCoins } from './features/counterSlice';
import moment from 'moment';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
const stc = require('string-to-color');

const Players=()=>{
    const [players,setPlayers]=useState([]);
	const [coins,set_coins]=useState([]);
    const [search,setSearch]=useState("");
    const [current_modal,setCurrent_modal]=useState(null);
    const [alerte,setAlerte]=useState("");
    const [current_user,setCurrent_user]=useState(useSelector(selectUser));
    const [password,setPassword]=useState("");
    const [index,setIndex]=useState(0);
    const [users_coins,set_users_coins]=useState(null);
    const [users_stats,set_users_stats]=useState(null);
    const [user_coins,set_user_coins]=useState(null);

    const dispatch=useDispatch();


    const load_users=async ()=>{
        const users=await db.collection("psg_users").get();
        const all_users=[];
        //document.querySelector(".players tbody").innerHTML="Loading...";
        users.forEach((u)=>{
            const user=u.data();
            
            all_users.push(user);
        })

        setPlayers(all_users);

    }

    const load_users_coins=()=>{
        db.collection("psg_users_coins")
        .get().then((snap)=>{
            const data=[];
            snap.docs.map((doc)=>{
                const key=doc.id;
                const d=doc.data()
                d.key=key;
                data.push(d);
            })
            set_users_coins(data);
        })
    }

    const load_users_stats=()=>{
        db.collection("psg_users_stats").get().then((snap)=>{
            const data=[];
            snap.docs.map((doc)=>{
                const key=doc.id;
                const d=doc.data()
                d.key=key;
                data.push(d);
            })
            set_users_stats(data);
        })
    }

    


    const u=useSelector(selectUsers);
	const c=useSelector(selectCoins);
	const [display,set_display]=useState(false);
    useEffect(()=>{
        load_users_coins();
        load_users_stats();
    },[])
    useEffect(()=>{
        setPlayers(u);
		
    },[u,users_coins,users_stats]);
	
	 /*useEffect(()=>{
		set_coins(c);
		c.map((item)=>{
			const email=item.user;
			const coins=item.coins;
			
		});
    },[c]);*/
    const td_coins=document.querySelectorAll(".coins");
    useEffect(()=>{
        if(coins.length==0){
            return;
        }
       if(td_coins==undefined){
           return;
       }

       for(var i=0; i<td_coins.length; i++){
           var td=td_coins[i];
           const user_email=td.dataset.user;
           console.log("tour de ",user_email);
           const res=c.filter((item)=>{
               return item.user==user_email;
           })
           if(res.length>0){
                const td_coins=res[0]?.coins;
                td.innerHTML=td_coins;
           }
           
       }
        
    },[coins,td_coins]);
	
	

    useEffect(()=>{
        const new_players=u.filter((user)=>{
            return user.email.toLowerCase().indexOf(search.toLowerCase())>=0 ||
                   user.status.toLowerCase().indexOf(search.toLowerCase())>=0 ||
                   user.username.toLowerCase().indexOf(search.toLowerCase())>=0 ||
                   user.ties?.indexOf(search)>=0 ||
                   user.win_per?.indexOf(search) >=0 ||
                   user.wins?.indexOf(search)>=0 ||
                   user.loses?.indexOf(search) >=0 ||
                   user.last_200?.indexOf(search) >=0 ||
                   user.last_10?.indexOf(search) >=0 ||
                   user.coins?.toString().indexOf(search) >=0
        });
        if(search!=""){
            setPlayers(new_players);
        }else{
            setPlayers(u);
        }
        
    },[search]);

    useEffect(()=>{
        dispatch(setUser(current_user));
    },[current_user,dispatch]);
	
	
	
	

    const delete_user=(user)=>{
        setAlerte("");
        var modal=document.querySelector("#modal_confirm");
        setCurrent_modal(modal);
        modal.style.display="block";
        var btn_yes=document.querySelector("#yes");
        btn_yes.dataset.key=user.id;
        btn_yes.dataset.action="DELETE_USER";
        setCurrent_user(user);
    }

    const confirm_yes=(e)=>{
        const btn=e.target;
        const key=btn.dataset.key;
        const action=btn.dataset.action;

        make_action(action,key);
       // setAlerte("going to delete..."+key+" and "+action);
    }
    const confirm_no=()=>{
        current_modal.style.display="none";
    }

    const make_action=async (action,key)=>{
        setAlerte("Please wait...");
        if(action=="DELETE_USER"){
            await db.collection("psg_users").doc(key).delete();
            setAlerte("");
            //load_users();
            current_modal.style.display="none";
        }
    }

    const reset_user_password=(user)=>{
        setAlerte("");
        console.log(user);
        
        setCurrent_user(user);
        dispatch(setUser(user));
        //return;
        const modal=document.querySelector("#modal_reset_password");
        setCurrent_modal(modal);
        modal.style.display="block";
    }

    const change_password=async ()=>{
        if(password==""){
            setAlerte("The password is empty");
            return;
        }

        setAlerte("Please wait...");
        await db.collection("psg_users").doc(current_user.id).set({
            password
        },{merge:true})
    }

    const user_profile=async (user)=>{
        setCurrent_user(user);
        dispatch(setUser(user));

        setAlerte("");
        const modal=document.querySelector("#modal_user_profile");
        setCurrent_modal(modal);
        modal.style.display="block";

        
    }

    const show_player_info=async (e)=>{
        clear_active_btn();
        var btn=e.target;
        btn.classList.add("active");
        setIndex(0);
    }

    const show_locker_room=async (e)=>{
        clear_active_btn();
        var btn=e.target;
        btn.classList.add("active");
        setIndex(1)
    }
    const show_trophy_room=async (e)=>{
        clear_active_btn();
        var btn=e.target;
        btn.classList.add("active");
        setIndex(2)
    }
    const show_history=async (e)=>{
        clear_active_btn();
        var btn=e.target;
        btn.classList.add("active");
        setIndex(3);
    }

    const clear_active_btn=()=>{
        const btns=document.querySelectorAll(".user_profile_menu > button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })
    }

    const [selected_player,set_selected_player]=useState(null);

    const show_user_coins_history=(user)=>{
        const email=user.email;
        const user_coins=users_coins?.filter((item)=>{
            return item.user==email;
        })
        set_user_coins(user_coins);
        const modal=document.querySelector("#modal_user_coins");
        modal.style.display="block";
        const res=players?.filter((item)=>{
            return item.email==email;
        })
        set_selected_player(res[0])
    }
    return(
        <div className="players">
            <div className="players__search_zone">
                <div>
                    <input type="search" placeholder="Search player" value={search} onChange={e=>setSearch(e.target.value)}/>
                    <SearchIcon style={{color:"white",fontSize:"1.2rem"}}/>
                </div>
            </div>
            <table border="1">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Photo</th>
                        <th>Username</th>
                        <th>Status</th>
                        <th>Email</th>
                        <th>OverAll %</th>
                        <th>Streak</th>
                        <th>Matches</th>
                        <th>Coins</th>
                        <th>Wins</th>
                        <th>Loses</th>
                        <th>O-U</th>
                        <th>L-10</th>
                        <th>L-200</th>
                        <th className="actions">Actions</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        players.map((user)=>{
							
                            let uc=users_coins?.filter((line)=>{
                                return line.user==user.email;
                            })
                            let total_coins=0;
                            if(uc!=undefined){
                                uc?.map((line)=>{
                                    const entry=parseFloat(line.entry);
                                    total_coins+=entry;
                                })
                            }

                            let us=users_stats?.filter((line)=>{
                                return line.key==user.email;
                            })
                            let stats=null;
                            if(us!=undefined){
                                stats=us[0];
                            }
                        
                            return(
                                <tr key={user.id}>
                        <td>{user.new_date}</td>
                        <td>
                           <div style={{
                               backgroundColor:stc(user.username),
                               width:"100%",
                               height:"40px",
                               borderRadius:"10px",
                               display:"flex",
                               alignItems:"center",
                               justifyContent:"center",
                               fontWeight:"bold",
                           }}>
                               {(user.username[0]+user.username[1]).toUpperCase()}
                           </div>
                            
                        </td>
                        <td>@{user.username}</td>
                        <td>{stats?.status}</td>
                        <td>{user.email}</td>
                        <td>{stats?.over_all}</td>
                        <td>{stats?.streak}</td>
                        
                        <td>{stats?.total_picks}</td>
                        <td className="coins" 
                        data-user={user.email} style={{
                            color:"gold"
                        }}
                        onClick={show_user_coins_history.bind(this,user)}
                        >
                            {total_coins}
                        </td>
                        <td>{stats?.wins}</td>
                        <td>{stats?.loses}</td>
                        <td>{stats?.wins_ou}-{stats?.loses_ou}</td>
                        <td>{stats?.last_10}</td>
                        <td>{stats?.last_200}</td>
                        <td className="actions">
                            {/*<button title="User profile" onClick={user_profile.bind(this,user)}>
                                <PersonIcon style={{fontSize:"1.2rem"}} />
                            </button>*/}
                            <button title="Reset password" onClick={reset_user_password.bind(this,user)}>
                                <CachedIcon  style={{fontSize:"1.2rem"}}/>
                            </button>
                            <button title="Delete user" onClick={delete_user.bind(this,user)}>
                                <DeleteIcon style={{fontSize:"1.2rem"}} />
                            </button>
                        </td>
                        
                    </tr>
                            );
                        })
                    }
                
                </tbody>
            </table>

            <div className="modal" id="modal_user_coins">
                <div className="modal-content">

                    <h2>@{selected_player?.username} coins History</h2>
                        {user_coins!=null &&
                        <div style={{minHeight:300,maxHeight:300,overflow:"auto"}}>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Coins</th>
                                    <th>-</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                user_coins?.map((line)=>{
                                    const dt=moment(line.date?.seconds*1000).format("ll")
                                    const e=parseFloat(line.entry);
                                    const id_ch=line.id_challenge;
                                    let name="";
                                    if(id_ch==0){
                                        name="Joining Bonus Coins"
                                    }else if(id_ch==1){
                                        name="Daily Bonus Coin"
                                    }else{
                                        if(e<=0){
                                            name="Challenge Entry fee"
                                        }else{
                                            name="Challenge Winning Coins"
                                        }   
                                       
                                    }
                                    return <tr key={line.key} style={{color:"black"}}>
                                            <td>{dt}</td> 
                                            <td>{name}</td>
                                            <td>{Math.abs(parseFloat(line.entry))}</td>
                                            <td>
                                                {e<0 &&<TrendingUpIcon style={{color:"red"}}/>}
                                                {e>0 &&<TrendingDownIcon />}
                                            </td>
                                        </tr>
                                })
                            }
                            </tbody>
                        </table>
                        </div>
                        }
                    <div 
                    style={{
                        
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"flex-end",
                    }}
                    >
                        <button
                        style={{
                            padding:8,
                            width:60,
                            backgroundColor:"indianred",
                            color:"white",
                            border:"none",
                            cursor:"pointer"
                        }}
                        onClick={()=>{
                            document.querySelector("#modal_user_coins").style.display="none";
                        }}>
                            close
                        </button>
                    </div>
                    
                </div>
            </div>

            <div className="modal" id="modal_confirm">
                <div className="modal-content">
                <span className="close">&times;</span>
                    <div className="confirm_body" >
                        <h1>Do you realy want to continue ?</h1>
                        <div>
                            <button onClick={confirm_yes} id="yes">Yes</button>
                            <button onClick={confirm_no}>No</button>
                        </div>
                        <div className="alerte_zone">{alerte}</div>
                       
                    </div>
                </div>
            </div>


            <div className="modal" id="modal_reset_password">
                <div className="modal-content">
                <span className="close">&times;</span>
                    <div className="confirm_body" >
                        <h1>Change {current_user?.username}'s password</h1>
                        <div className="change_pw_content">
                            <div>
                                <input type="text" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)}/>
                                <VpnKeyIcon />
                            </div>
                           
                            <button onClick={change_password}>Change password</button>
                        </div>
                        <div className="alerte_zone">{alerte}</div>
                       
                    </div>
                </div>
            </div>


            <div className="modal" id="modal_user_profile">
                <div className="modal-content">
                <span className="close">&times;</span>
                    <div className="profil_body_content" >
                        <div className="user_profile_top_info">
                            <div className="top_info">
                                <div className="top_info_user">
                                    {
                                        current_user?.photo=="foo.jpg"?<AccountCircleIcon />:
                                        <img src={current_user?.photo} />
                                    }
                               
                                <div className>
                                    <p>{current_user?.username}</p>
                                    <p>{current_user?.new_date}</p>
                                </div>
                                </div>
                                <div className="top_info_coins">
                                    <p>{current_user?.coins} coins</p>
                                    <button>Deposit</button>
                                </div>
                            </div>
                            <div className="bottom_info">
                                <div>
                                    <p>0</p>
                                    <p>Games</p>
                                </div>
                                <div>
                                    <p>0</p>
                                    <p>Picks</p>
                                </div>
                                <div>
                                    <p>321</p>
                                    <p>Following</p>
                                </div>
                            </div>
                        </div>
                        <div className="user_profile_menu">
                            <button onClick={show_player_info} className="active">Player Info</button>
                            <button onClick={show_locker_room}>Locker Room</button>
                            <button onClick={show_trophy_room}>Trophy Room</button>
                            <button onClick={show_history}>History</button>
                        </div>
                        <div className="user_profile_page">
                            {
                                index==0 && current_user!=null ? <PlayerInfo user={current_user} /> :
                                <div>Coming soon for {index} </div>
                            }
                        </div>
                        <div className="alerte_zone">{alerte}</div>
                       
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Players;