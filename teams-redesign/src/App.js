import './App.scss';
import {useEffect, useState} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import NotFound from "./pages/NotFound";
import {getUser} from "./api";
import {Header} from "./components/Header";
import {MyTeams} from "./pages/MyTeams";
import TeamDetails from "./pages/TeamDetails";
import {Footer} from "./components/Footer";
import NewTeam from "./pages/NewTeam";

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
                <Route path="/" element={<Navigate replace to="my-teams"/>}/>
                <Route path={"my-teams"} element={<MyTeams/>}/>
                <Route path={"new-team"} element={<NewTeam user={user}/>}/>
                <Route path={"/team-details/:teamId"} element={<TeamDetails user={user}/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>}
            <Footer user={user}/>
        </div>
    );
}

export default App;
