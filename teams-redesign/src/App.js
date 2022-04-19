import './App.scss';
import {useEffect, useState} from "react";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import NotFound from "./pages/NotFound";
import {getUser} from "./api";
import Home from "./pages/Home";

const App = () => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});

    useEffect(() => {
        getUser()
            .then(currentUser => {
                if (!currentUser || !currentUser.person) {
                    //Show generic error dialog
                } else {
                    //shortcut notation
                    currentUser.superAdmin = currentUser.person.superAdmin;
                    currentUser.superAdminModus = false;
                    setLoading(false);
                    setUser(currentUser);
                }
            })
            .catch(() => {
                //Show generic error dialog
            })
        ;
    },);

    if (loading) {
        return null; // render null when app is not ready yet
    }
    return (
        <div className="teams">
            <div className="container">
                {/*<Header user={user}/>*/}
                {<Routes>
                    <Route path="/" element={<Navigate replace to="home"/>}/>
                    <Route path="home">
                        <Route path=":tab" element={<Home user={user}/>}/>
                        <Route path="" element={<Home user={user}/>}/>
                    </Route>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>}
            </div>
            {/*<Footer/>*/}
        </div>
    );
}

export default App;
