import LockIcon from '@material-ui/icons/Lock';
import { useState } from 'react';
import { auth } from './firebase_file';

const Login= ()=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const [alerte,setAlerte]=useState("");
    
    const login=async ()=>{
        if(email==""){
            setAlerte("The email is empty");
            return;
        }

        if(password==""){
            setAlerte("The password is empty");
            return;
        }

        setLoading(true);
        setAlerte("Please wait...");
        try{
            await auth.signInWithEmailAndPassword(email,password);
        }catch(err){
            setAlerte(err);
        }
        
    }
    return(
        <div className="login">
            <LockIcon />
            <h1>Login as Admin</h1>
            <div className="login__input_zone">
                <label>Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className="login__input_zone">
                <label>Password</label>
                <input type="password"  value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <button onClick={login}>Login</button>

            <div className="alerte">{alerte}</div>
        </div>
    );
}

export default Login;