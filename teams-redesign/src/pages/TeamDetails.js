import "./Home.scss";
import {Page} from "../components/Page";
import {SubHeader} from "../components/SubHeader";
import {BreadCrumb} from "../components/BreadCrumb";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getTeamDetail} from "../api";
import I18n from "i18n-js";

const TeamDetail = () => {

    const params = useParams();

    const [team, setTeam] = useState({});

    useEffect(() => {
        getTeamDetail(params.teamId).then(res => setTeam(res));
    }, [params.teamId])

    return (
        <Page>
            <SubHeader>
                <BreadCrumb paths={[
                    {name: I18n.t("breadcrumbs.myTeams"), to: "/my-teams"},
                    {name: team.name},
                    ]}/>
            </SubHeader>
            <SubHeader>
                <div className="team-actions">
                    <div>
                        <h2>{team.name}</h2>
                        <p>{team.description}</p>
                    </div>

                </div>
            </SubHeader>
            <div className="team-detail">
            TDOO
            </div>
        </Page>

    );

}
export default TeamDetail;