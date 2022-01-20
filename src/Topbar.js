import LockOpenIcon from '@material-ui/icons/LockOpen';
import {auth} from "./firebase_file";
const Topbar=()=>{
    const logout=()=>{
        auth.signOut();
    }
    return(
        <div className="topbar">
            <h1>Prosport.Guru Inc.</h1>
            <button title="Logout" onClick={logout}>
                <LockOpenIcon />
            </button>
        </div>
    );
}

export default Topbar;