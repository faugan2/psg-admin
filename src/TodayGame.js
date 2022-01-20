import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
const TodayGame=()=>{
    return(
        <div className="todaygame">
            <div className="todaygame__top">
                <div>
                    <EmojiEventsIcon />
                    <h1>NCCAF</h1>
                </div>
                <div>
                    <button>BUY</button>
                </div>
            </div>
            <div className="todaygame__center">
                <div>
                    <h1>21-10-2021</h1>
                    <p>Date</p>
                </div>
                <div>
                    <h1>Football</h1>
                    <p>Games</p>
                </div>
                <div>
                    <p>Team 1</p>
                    <p>Team 2</p>
                </div>
                <div>
                    <p>25</p>
                    <p>12</p>
                </div>
            </div>
            <div className="todaygame__bottom">
                <div>
                    <button>Spread</button>
                    <button>Points 0.5</button>
                </div>
                <div>
                    <button>1000 Coins</button>
                </div>
            </div>
        </div>
    );
}
export default TodayGame;