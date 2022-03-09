import DeleteIcon from '@material-ui/icons/Delete';
import DateRangeIcon from '@material-ui/icons/DateRange';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import TitleIcon from '@material-ui/icons/Title';
import "../styles/create_game.scss";

import {useState,useEffect} from "react";
import {useSelector} from "react-redux";
import {selectSports,selectLeagues} from "../features/counterSlice"
import firebase from "firebase";
import {db} from "../firebase_file";

const moment=require("moment-timezone");

const CreateGame=()=>{

    const sports=useSelector(selectSports);
    const leagues=useSelector(selectLeagues);

    const [date,set_date]=useState("");
    const [time,set_time]=useState("");
    const [total,set_total]=useState("");
    const [away,set_away]=useState("");
    const [away_ml,set_away_ml]=useState("");
    const [away_spread,set_away_spread]=useState("");
    const [over,set_over]=useState("");
    const [home,set_home]=useState("");
    const [home_ml,set_home_ml]=useState("");
    const [home_spread,set_home_spread]=useState("");
    const [under,set_under]=useState("");
    const [all_leagues,set_all_leagues]=useState([]);
    const [sport,set_sport]=useState("");
    const [league,set_league]=useState("");
    const [alerte,set_alerte]=useState("");

    const create_game=()=>{
       if(date==""){
           set_alerte("The date is empty");
           return;
       }
       if(time==""){
           set_alerte("The time is empty")
           return;
       }
       if(total==""){
           set_alerte("The total is empty");
           return;
       }
       if(sport==""){
           set_alerte("The sport is empty");
           return;
       }
       if(league==""){
           set_alerte("The league is empty");
           return;
       }
       if(away==""){
           set_alerte("The away team is empty");
           return;
       }
       if(home==""){
           set_alerte("The home team is empty");
           return;
       }

       const str_date=new Date(date+" "+time);
       
       
       const game={
           away,
           away_abbr:"",
           away_moneyline:away_ml,
           away_score:"",
           away_spread,
           commence:moment(str_date).utc().format(),
           date:firebase.firestore.Timestamp.fromDate(str_date),
           home,
           home_abbr:"",
           home_moneyline:home_ml,
           home_score:"",
           home_spread,
           league,
           over,
           start:moment(str_date).format("lll"),
           time:str_date.getTime(),
           total,
           under,
       }

       set_alerte("Please wait...");
       db.collection("psg_games").add(game).then((res)=>{
           set_alerte("Game created successfuly");
           set_away("");
           set_home("");
           set_away_ml("");
           set_away_spread("");
           set_home_ml("");
           set_home_spread("");
           set_over("");
           set_under("");
           set_total("");
       }).catch((err)=>{
           set_alerte(err.message)
       })
    }
    const sport_changes=(e)=>{
        const id=e.target.value;
        set_sport(id)
        const l=leagues.filter((item)=>{
            return item.id_sport==id;
        })

        set_all_leagues(l);
    }

    const league_changes=(e)=>{
        set_league(e.target.value);
    }

  

    return(
        <div className="create_game">

            <div className="create_game_sport">
                <div className="line">
                    <label>Sport</label>
                    <select onChange={sport_changes} defaultValue={sport}>
                        <option></option>
                        {
                            sports.map((item,i)=>{
                                return(
                                    <option key={i} value={item.id}>
                                        {item.name}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>

                <div className="line">
                    <label>League</label>
                    <select defaultValue={league} onChange={league_changes}>
                        <option></option>
                        {
                            all_leagues.map((item,i)=>{
                                return(
                                    <option key={item.id}>
                                        {item.name}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
            <div className="game_detail_content" >
                        <div className="game_detail_date">
                            <div>
                                <DateRangeIcon />
                                <input type="date" 
                                value={date}
                                onChange={e=>set_date(e.target.value)}
                                />
                            </div>

                            <div>
                                <QueryBuilderIcon />
                                <input type="time" 
                                 value={time}
                                 onChange={e=>set_time(e.target.value)}
                                />
                            </div>
                            <div>
                                <p>Total=</p>
                                <input type="text" 
                                 value={total}
                                 onChange={e=>set_total(e.target.value)}
                                />
                            </div>
                            
                        </div>
                        <div className="game_detail_info">
                            
                           
                            
                            <div>
                                <div style={{width:"50%"}}>
                                    <p>Away</p>
                                <input type="text" placeholder="Away team name"
                             value={away}
                             onChange={e=>set_away(e.target.value)}
                             style={{width:"100%"}}
                            />
                                </div>
                            
                                <div>
                                    <p>MoneyLine</p>
                                    <input type="text"  
                                     value={away_ml}
                                     onChange={e=>set_away_ml(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <p>Spread</p>
                                    <input type="text" 
                                     value={away_spread}
                                     onChange={e=>set_away_spread(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <p>Over</p>
                                    <input type="text" 
                                     value={over}
                                     onChange={e=>set_over(e.target.value)}
                                    />
                                </div>

                                
                                
                                
                            </div>

                        </div>


                        <div className="game_detail_info">
                            
                            
                            <div>
                                <div style={{width:"50%"}}>
                                    <p>Home</p>
                                    <input type="text"  placeholder="Home team name"
                             value={home}
                             onChange={e=>set_home(e.target.value)}
                             style={{width:"100%"}}
                            />
                                </div>
                            
                                <div>
                                    <p>MoneyLine</p>
                                    <input type="text"  
                                     value={home_ml}
                                     onChange={e=>set_home_ml(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <p>Spread</p>
                                    <input type="text"  
                                     value={home_spread}
                                     onChange={e=>set_home_spread(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <p>Under</p>
                                    <input type="text" 
                                     value={under}
                                     onChange={e=>set_under(e.target.value)}
                                    />
                                </div>

                                
                                
                                
                            </div>

                        </div>

                        <button onClick={create_game}>Submit</button>
                        <p className="alerte" 
                        style={{margin:"0.5rem",color:"white",fontWeight:"bold"}}>{alerte}</p>
                       
                    </div>
        </div>
    );
}

export default CreateGame;