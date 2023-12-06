import './App.scss';
import {useEffect, useState} from "react";
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
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
import {MissingAttributes} from "./pages/MissingAttributes";
import I18n from "i18n-js";

const App = () => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({person: {}, config: {supportedLanguageCodes: "nl,en"}});
    const [missingAttributes, setMissingAttributes] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        if (pathname) {
            const end = pathname.indexOf("/", 1);
            const path = pathname.substring(1, end === -1 ? pathname.length : end);
            const headerTitles = I18n.translations[I18n.locale].headerTitles;
            const subTitle = headerTitles[path];
            document.title = I18n.t("headerTitles.index", {page: subTitle || ""});
        }
    }, [location]);

    useEffect(() => {
        getUser()
            .then(currentUser => {
                if (!currentUser || !currentUser.person) {
                    //Show generic error dialog
                } else {
                    //shortcut notation
                    currentUser.superAdmin = currentUser.person.superAdmin;
                    currentUser.superAdminModus = currentUser.superAdmin;
                    setUser(currentUser);
                    setSuperAdmin(currentUser.superAdminModus);
                    setLoading(false);
                }
            })
            .catch(e => {
                if (e.response && e.response.status === 409) {
                    e.response.json().then(res => {
                        setLoading(false);
                        setMissingAttributes(res);
                        navigate("/missing-attributes");
                    })
                }
            })
        ;
        // eslint-disable-next-line
    }, []);


    const toggleSuperAdminModus = () => {
        const newUser = {...user, superAdminModus: !user.superAdminModus};
        setUser(newUser);
        setSuperAdmin(newUser.superAdminModus);
    }

    if (loading) {
        return null; // render null when app is not ready yet
    }
    return (
        <div className="teams">
            <Flash/>
            <Header user={user} toggleSuperAdminModus={toggleSuperAdminModus}/>
            <main id={"content"}>
                {<Routes>
                    <Route path="/" element={<Navigate replace to="my-teams"/>}/>
                    <Route path={"/my-teams"} element={<MyTeams user={user}/>}/>
                    <Route path={"/public-teams"} element={<MyTeams user={user}/>}/>
                    <Route path={"/new-team"} element={<NewTeam user={user}/>}/>
                    <Route path={"/edit-team/:teamId"} element={<NewTeam user={user}/>}/>
                    <Route path={"/team-details/:teamId"} element={<TeamDetails user={user}/>}/>
                    <Route path={"/team-details/:teamId/:members"}
                           element={<TeamDetails user={user} showMembers={true}/>}/>
                    <Route path={"/invitation/accept/:hash"} element={<TeamDetails user={user}/>}/>
                    <Route path={"/public/:publicLink"} element={<TeamDetails user={user}/>}/>
                    <Route path={"/teams/:teamId"} element={<JoinRequest user={user}/>}/>
                    <Route path={"/join-request/:teamId"} element={<JoinRequest user={user}/>}/>
                    <Route path={"/join-request/:teamId/:joinRequestId"} element={<JoinRequest user={user}/>}/>
                    <Route path={"/missing-attributes"} element={<MissingAttributes missingAttributes={missingAttributes}/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>}
            </main>
            <Footer user={user}/>
        </div>
    );
}

export default App;
