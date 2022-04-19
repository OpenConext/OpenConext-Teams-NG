import './App.scss';
import {useEffect, useState} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import NotFound from "./pages/NotFound";
import {getUser} from "./api";
import Home from "./pages/Home";
import {Header} from "./components/Header";
import {MyTeams} from "./pages/MyTeams";
import TeamDetails from "./pages/TeamDetails";
import {Footer} from "./components/Footer";

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
    }, []);

    if (loading) {
        return null; // render null when app is not ready yet
    }
    return (
        <div className="teams">
            <Header user={user}/>
            {<Routes>
                <Route path="/" element={<Navigate replace to="home"/>}/>
                <Route path="home">
                    <Route path=":tab" element={<Home user={user}/>}/>
                    <Route path="" element={<Home user={user}/>}/>
                </Route>
                <Route path={"my-teams"} element={<MyTeams/>}/>
                <Route path={"team-details"} element={<TeamDetails/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>}
            <Footer user={user}/>
        </div>
    );
}

export default App;
