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

const Players=()=>{
    const [players,setPlayers]=useState([]);
	const [coins,set_coins]=useState([]);
    const [search,setSearch]=useState("");
    const [current_modal,setCurrent_modal]=useState(null);
    const [alerte,setAlerte]=useState("");
    const [current_user,setCurrent_user]=useState(useSelector(selectUser));
    const [password,setPassword]=useState("");
    const [index,setIndex]=useState(0);
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

    


    const u=useSelector(selectUsers);
	const c=useSelector(selectCoins);
	const [display,set_display]=useState(false);
    useEffect(()=>{
        setPlayers(u);
		
    },[u]);
	
	 useEffect(()=>{
		set_coins(c);
		c.map((item)=>{
			const email=item.user;
			const coins=item.coins;
			
		});
    },[c]);
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
                        <th>Email</th>
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
							
							
                        
                            return(
                                <tr key={user.id}>
                        <td>{user.new_date}</td>
                        <td>
                            {
                                user.photo!="foo.jpg" ? <img src={user.photo} className="userimage"/>:
                                <AccountCircleIcon />
                            }
                            
                        </td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td className="coins" data-user={user.email}>{user.coins}</td>
                        <td>{user.wins}</td>
                        <td>{user.loses}</td>
                        <td>0-0</td>
                        <td>0-0</td>
                        <td>0-0</td>
                        <td className="actions">
                            <button title="User profile" onClick={user_profile.bind(this,user)}>
                                <PersonIcon style={{fontSize:"1.2rem"}} />
                            </button>
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