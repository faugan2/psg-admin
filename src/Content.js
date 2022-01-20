import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Main from "./Main";

const Content=()=>{
    
    return(
        <div className="content">
            <Topbar />
            <div className="content__page">
                <Sidebar />
                <Main />
            </div>
        </div>
    );
}

export default Content;