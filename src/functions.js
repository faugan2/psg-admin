const calculate_pick_win=(data)=>{
    //data={id_game,pickdata,team_picked,type_pick,home_score,away_score,mode}
    const mode=data.mode;
    const type_pick=parseInt(data.type_pick);
    const pickdata=data.pickdata?.split(",");
    const team_picked=parseInt(data.team_picked);
    const home_score=parseInt(data.home_score);
    const away_score=parseInt(data.away_score);
    let info="";
    let result="";
    
    
    if(type_pick==1){
        //ml
      //  console.log("ML")
        const ml_away=parseInt(pickdata[0]);
        const ml_home=parseInt(pickdata[1]);
       // console.log("this is moneyline",team_picked)

        if(team_picked==2){
            //home team picked
            console.log("this is",team_picked,home_score,away_score);
            if(home_score>away_score){
                //win
                info=`Win N°19, ${home_score} > ${away_score}`;
                result= 1;
            }
            if(home_score<away_score){
                //lose
                info=`Lost N°20, ${home_score} < ${away_score}`;
                result= 0;
            }
            //tie
            if(home_score==away_score){
                info=`Tie N° 21, ${home_score} = ${away_score}`;
                result= 2;
                
            }
            //console.log("this is ",{result,info})
            return {result,info};
        }else{
            //away team picked
            if(away_score>home_score){
                //win
                
                info=`Win N° 22, ${away_score} > ${home_score}`;
                result= 1;
            }
            if(away_score<home_score){
                //lose
                info=`Lost N°23, ${away_score} < ${home_score}`;
                result= 0;
                //return 0;
            }
            //tie 
            if(away_score==home_score){
                
                info=`Tie N°24, ${away_score} = ${home_score}`;
                result= 2;
            }
           //tie console.log("this is ",{result,info})
            return {result,info};
            
        }
       
        
        
    }else if(type_pick==2){
        //spread
        const spread_away=parseFloat(pickdata[2]);
        const spread_home=parseFloat(pickdata[3]);
       

        if(team_picked==2){
            //home team picked
            var diff=home_score-away_score;
            if(spread_home <0){
              
                var v=Math.abs(spread_home);
                if(diff<0){
                    //lose
                    info=`Lost N°1, You picked spread of -${spread_home}, but the difference score is ${diff}`
                    result= 0;
                }else{
                    if(diff>=v){
                        //win
                        info=`Win N°2, You picked spread of -${spread_home}, and the difference score is ${diff} which is >= ${v}`
                        result= 1;
                    }else{
                        //lose
                        info=`Lost N°3, You picked spread of -${spread_home}, and the difference score is ${diff} which is < ${v}`
                        result= 0;
                    }
                }
            }else{
                
                var v=Math.abs(spread_home);
                if(diff>0){
                    //win
                    info=`Win N°4, You picked spread of +${spread_home}, and the difference score is ${diff} `
                    result= 1;
                }else{
                    if(Math.abs(diff)<=v){
                        //win
                        info=`Win N°5, You picked spread of +${spread_home}, and the difference score is ${diff} witch is <=${v} `
                        result= 1;
                    }else{
                        //lose
                        info=`Lost N°6, You picked spread of +${spread_home}, and the difference score is ${diff} wich is > ${v} `
                        result= 0;
                    }
                }
                
            }
            return {result,info};
        }else{
            //away team picked
            var diff=away_score-home_score;
            if(spread_away <0){
               
                var v=Math.abs(spread_away);
                if(diff<0){
                    //lose
                    info=`Lost N°7, You picked spread of -${spread_away}, but the difference score is ${diff} <0`
                    result= 0;
                }else{
                    if(diff>=v){
                        //win
                        info=`Win N°8, You picked spread of -${spread_away}, and the difference score is ${diff} which is >= ${v}`
                        result= 1;
                    }else{
                        //lose
                        info=`Lost N°9, You picked spread of -${spread_away}, and the difference score is ${diff} which is < ${v}`
                        result= 0;
                    }
                }
               
            }else{
                
                var v=Math.abs(spread_away);
                if(diff>0){
                    //win
                    info=`Win N°10, You picked spread of +${spread_away}, and the difference score is ${diff} >0`
                    result= 1;
                }else{
                    if(Math.abs(diff)<=v){
                        //win
                        info=`Win N°11, You picked spread of +${spread_away}, and the difference score is ${diff} witch is <=${v} `
                        result= 1;
                    }else{
                        //lose
                        info=`Lost N°12, You picked spread of +${spread_away}, and the difference score is ${diff} wich is > ${v} `
                        result= 0;
                    }
                }
                
            }
            return {result,info};
           
        }
       
        
    } else if(type_pick==3){
        //over under
        //console.log("over and under")
        const over=parseFloat(pickdata[4]);
        const under=parseFloat(pickdata[5]);
        const total=parseFloat(pickdata[6]);
        //let v=Math.abs(over);
        let v=Math.abs(total);
        if(team_picked==1){
            //over;
            let total_score=away_score+home_score;
            if(total_score>v){
                //win
                info=`Win N°13, You picked over of ${v}, and the total score is ${total_score} wich is > ${v} `
                result= 1;
            }
            if(total_score<v){
                //lose
                info=`Lost N°14, You picked over of ${v}, and the total score is ${total_score} wich is < ${v} `
                result= 0;
            }
            if(total_score==v){
                //tie
                info=`Tie N°15, You picked over of ${v}, and the total score is ${total_score} wich is = ${v} `
                result= 2;
            }
           

        }else if(team_picked==2){
            //under
            let total_score=away_score+home_score;
            if(total_score<v){
                //win
                info=`Win N°16, You picked under of ${v}, and the total score is ${total_score} wich is < ${v} `
                result= 1;
            }
            if(total_score>v){
                //lose
                info=`Lost N°17, You picked under of ${v}, and the total score is ${total_score} wich is > ${v} `
                result= 0;
            }
            if(total_score==v){
                //tie
                info=`Tie N°18, You picked under of ${v}, and the total score is ${total_score} wich is = ${v} `
                result= 2;
            }
           
        }
        return {result,info};
        

        
    }
   
}


const get_winners=(data,mode)=>{
    if(mode==1){
        //most wins;
        const wins=[];
        data.map((line)=>{
            const user=line.user;
            const results=line.results;
            const total_wins=results.filter((item)=>{
                return item==1;
            }).length;
            wins.push({user,total_wins});
        })
        
        // get max
        let max=0;
        const res=wins.map((item)=>{
            const v=item.total_wins;
            const u=item.user;
            if(v>max){
                max=v;
            }

        })
        //console.log("the max is ",max);

        const winners=wins.filter((item)=>{
            return item.total_wins==max;
        })
        //console.log("the winners are ",winners);
        return {wins,winners};
    }

    if(mode==2){
        //longest winning strea;
        const wins=[];
        data.map((item)=>{
            const user=item.user;
            const results=item.results;
            let streak=0;
            results.forEach((res)=>{
                if(res==1){
                    streak++;
                }else if(res==0){
                    streak=0;
                }
            })
            wins.push({user,total_wins:streak});
            console.log(user,streak);
        })

        let max=0;
        const res=wins.map((item)=>{
            const v=item.total_wins;
            const u=item.user;
            if(v>max){
                max=v;
            }

        })
        const winners=wins.filter((item)=>{
            return item.total_wins==max;
        })
       
        return {wins,winners};
    }
   
}
export {calculate_pick_win,get_winners};