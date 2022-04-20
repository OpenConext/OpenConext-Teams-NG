import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {deleteTeam, getMyTeams} from "../api";
import I18n from "i18n-js";
import "./MyTeams.scss"
import {Page} from "../components/Page";
import binIcon from "../icons/bin-1.svg";
import blockedIcon from "../icons/allowances-no-talking.svg";
import { ROLES } from "../utils/roles";


export const MyTeams = () => {

    const [teams, setTeams] = useState({
        teamSummaries: []
    });
    const [searchQuery,setSearchQuery] = useState("");
    const [displayedTeams,setDisplayedTeams] = useState([]);
    const [teamsFilter,setTeamsFilter] = useState('ALL');

    useEffect(() => {
        getMyTeams().then(teams => {
            setTeams(teams);
        })
    }, []);

    useEffect(() => {
        updateDisplayedTeams()
    },[teams,searchQuery,teamsFilter])

    const updateDisplayedTeams =()=>{
        const toDisplay = teams.teamSummaries.filter(team =>{
            if (teamsFilter != team.role && teamsFilter != 'ALL'){
                return
            }

            if (searchQuery === ""){
                return team;
            }else if (team.name.toLowerCase().includes(searchQuery.toLowerCase())){
                return team
            }
        })
        setDisplayedTeams(toDisplay)
    }

    const renderPrivateTag = viewable => {
        const tag = <span className="private-label">
            <span><img src={blockedIcon} alt="Private"/>{I18n.t("myteams.private")}</span>

        </span>
        return (
            <>{viewable ? I18n.t("myteams.empty") : tag}</>
        )
    }

    const processDelete = team => {
        //TODO first show confirmation modal
        deleteTeam(team.id).then(() => {
            getMyTeams().then(teams => {
                setTeams(teams);
            })
        })
    }

    const renderAddMemberLink = team => {
        const link = <Link to={{ pathname: "/", state: { team: team } }}>{I18n.t("myteams.add_members")}</Link> 
        return (
            <>{ROLES.MEMBER !== team.role ? link: I18n.t("myteams.empty")}</>
        )
    }

    const renderDeleteButton = team => {
        const icon = <img className="binIcon" src={binIcon} alt="Delete" onClick={() => processDelete(team)} />
        return (
            <>{[ROLES.OWNER, ROLES.ADMIN].includes(team.role) ? icon : I18n.t("myteams.empty")}</>
        )
    }

    const renderTeamsRow = team => {
        return (<tr>
            <td><Link to={`/team-details/${team.id}`}>{team.name}</Link></td>
            <td>{team.membershipCount}</td>
            <td>{renderPrivateTag(team.viewable)}</td>
            <td>{renderAddMemberLink(team)}</td>
            <td>{renderDeleteButton(team)}</td>
        </tr>)
    }

    const renderTeamsSearch = () =>{
        return(
            <input placeholder="Search" onChange={e => setSearchQuery(e.target.value)} />
        )
    }

    const renderFilterDropdown = () =>{
        class FilterCount{
            constructor(value){
                if (value === 'ALL'){
                    this.value = value;
                    this.count = teams.teamSummaries.length;
                    return this;
                }
                this.value = value
                this.count = 0
            }
            get label(){
                return`${I18n.t(`myteams.filters.${this.value.toLowerCase()}`)} (${this.count})`
            }
        }

        const filters = ['ALL',ROLES.OWNER, ROLES.ADMIN,ROLES.MANAGER,ROLES.MEMBER]
        const options = filters.map(filter=>new FilterCount(filter))

        teams.teamSummaries.forEach(team=>{
            options.forEach(option=>{
                if (option.value === team.role){
                    option.count ++;
                }
            })
        })

        const why=(e)=>{
            var hm =1
        }

        return(
            <select className="filter_dropdown"  onChange={event => why(event.target)}>
            {options.map(option=>option.count >0 || option.value === 'ALL'? <option id={option.value}>{option.label}</option>:null)}
        </select>
        )
    }

    const renderNewTeamButton = () =>{

    }

    const renderTeamsTable = () => {
        const headers = ["title", "members", "private", "member", "bin"];
        return (
            <Page>
                <h2>My teams</h2>
                <span className="teamActionsBar"> {renderFilterDropdown()}{renderTeamsSearch()}</span>
                <table>
                    <thead>
                    <tr>
                        {headers.map(header => <th className={header}>
                            {I18n.t(`myteams.columns.${header}`)}
                        </th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {displayedTeams.map(team => renderTeamsRow(team))}
                    </tbody>
                </table>
            </Page>
        )
    }

    return (
        <div className="my-teams-container">
            <div>TODO - header, drop-down (admin 4, members 3) - search box</div>
            {renderTeamsTable()}
        </div>
    );

}