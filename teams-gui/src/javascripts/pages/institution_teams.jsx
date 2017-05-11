import React from "react";
import PropTypes from "prop-types";
import LinkedInstitutionTeams from "../components/linked_institution_teams";
import {linkedTeams} from "../api";
import {clearFlash} from "../utils/flash";

export default class InstitutionTeams extends React.Component {

    constructor(props) {
        super(props);
        const institutionTeams = [...(props.currentUser.externalTeams || [])].sort((a, b) => a.name.localeCompare(b.name));
        this.state = {
            institutionTeams: institutionTeams,
            linkedTeams: {}
        };
    }

    componentWillMount = () => {
        clearFlash();
        linkedTeams().then(linked => this.setState({linkedTeams: linked}));
    };

    render() {
        const {linkedTeams} = this.state;
        const {currentUser} = this.props;
        return (
            <section className="institution_teams_page">
                <LinkedInstitutionTeams institutionTeams={currentUser.externalTeams} linkedTeams={linkedTeams}
                                        includeLegend={true} currentUser={currentUser}/>
            </section>
        );
    }
}

InstitutionTeams.propTypes = {
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};

