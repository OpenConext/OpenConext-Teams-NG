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
import Flash from "./flash/Flash";
import {JoinRequest} from "./pages/JoinRequest";
import {setSuperAdmin} from "./store/store";

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

    const toggleSuperAdminModus = val => {
        const newUser = {...user, superAdminModus: val};
        setUser(newUser);
        setSuperAdmin(val);
    }

    if (loading) {
        return null; // render null when app is not ready yet
    }
    return (
        <div className="teams">
            <Flash/>
            <Header user={user} toggleSuperAdminModus={toggleSuperAdminModus}/>
            {<Routes>
                <Route path="/" element={<Navigate replace to="my-teams"/>}/>
                <Route path={"/my-teams"} element={<MyTeams/>}/>
                <Route path={"/new-team"} element={<NewTeam user={user}/>}/>
                <Route path={"/edit-team/:teamId"} element={<NewTeam user={user}/>}/>
                <Route path={"/team-details/:teamId"} element={<TeamDetails user={user}/>}/>
                <Route path={"/invitation/accept/:hash"} element={<TeamDetails user={user}/>}/>
                <Route path={"/join-request/:teamId"} element={<JoinRequest user={user}/>}/>
                <Route path={"/join-request/:teamId/:joinRequestId"} element={<JoinRequest user={user}/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>}
            <Footer user={user}/>
        </div>
    );
}

export default App;
