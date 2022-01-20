import RoomIcon from '@material-ui/icons/Room';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSports, selectUser } from './features/counterSlice';
import TodayGame from './TodayGame';


const PlayerInfo=(props)=>{
    const dispatch=useDispatch();
    const u=useSelector(selectUser);

    useEffect(()=>{
       setCurrent_user(u);
    },[u])

    
    const [sports,setSports]=useState(useSelector(selectSports));
    const [sport_name,setSportname]=useState("All");
    const [sport_key,setSport_key]=useState(0);
    const [current_user,setCurrent_user]=useState(useSelector(selectUser))
    
    
    const setCurrent_sport=(e)=>{
       
        var btns=document.querySelectorAll(".world_ranking_sports > button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })
        const btn=e.target;
        btn.classList.add("active");
        const key=btn.dataset.key;
        setSport_key(key);
        setSportname(btn.innerText);
        

    }
   
    return(
        <div className="playerinfo_page">
            <div className="playerinfo_page_status">
                <div  className="active">
                    <RoomIcon />
                    <p>Clown</p>
                </div>
                <div>
                    <RoomIcon />
                    <p>Pretender</p>
                </div>
                <div>
                    <RoomIcon />
                    <p>Player</p>
                </div>
                <div>
                    <RoomIcon />
                    <p>Capper</p>
                </div>
                <div>
                    <RoomIcon />
                    <p>Sharp</p>
                </div>
                
            </div>
            <div className="world_ranking">
                <div className="world_ranking_sports">
                    <button className="active" onClick={setCurrent_sport} data-key={0}>All</button>
                    {
                        sports.map((sport)=>{
                            return(
                                <button 
                                    key={sport.key}  
                                    onClick={setCurrent_sport} 
                                    data-key={sport.key}
                                >{sport.name}</button>
                            )
                        })
                    }
                </div>

                <div className="world_ranking_stats">
                    <div className="world_ranking_stats_top">   
                        <h1>World Ranking</h1>
                        <p>3 of 23 000</p>
                    </div>
                    
                    <div className="world_ranking_card">
                        <div className="world_ranking_card_header">
                            <p>{sport_name} Report Cards</p>
                        </div>
                        <div className="world_ranking_card_body">
                            <div>
                                <p>Win</p>
                                <p>{current_user.wins}</p>
                            </div>

                            <div>
                                <p>Lost</p>
                                <p>{current_user.loses}</p>
                            </div>
                            <div>
                                <p>Overall Winning %</p>
                                <p>{current_user.win_per}</p>
                            </div>
                            <div>
                                <p>Longest Winning Streak</p>
                                <p>{current_user.streak}</p>
                            </div>
                            <div>
                                <p>Last 10</p>
                                <p>{current_user.last_10}</p>
                            </div>
                            <div>
                                <p>Last 200</p>
                                <p>{current_user.last_200}</p>
                            </div>
                            <div>
                                <p>Over/Under</p>
                                <p>0-0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="block_today_game">
                <h1>Today's games</h1>
                <TodayGame />
            </div>
        </div>
    )
}

export default PlayerInfo;