import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";
import debounce from "lodash/debounce";

import CheckBox from "../components/checkbox";
import {saveTeam, teamExistsByName} from "../api";
import {setFlash} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";

const validNameRegExp = /^[\w \-']{1,255}$/;

export default class NewTeam extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            name: "",
            description: "",
            personalNote: "",
            viewable: true,
            email: "",
            invitationMessage: "",
            initial: true,
            format: true,
            exists: false,
            approval: true
        };
    }

    componentDidMount() {
        this.nameInput.focus();
    }

    changeTeamName = e => {
        const name = e.target.value;
        const format = !isEmpty(name) && validNameRegExp.test(name.trim());
        this.setState({name: name, format: format, initial: false});
        if (format) {
            this.delayedNameExists();
        }
    };

    delayedNameExists = debounce(() =>
        teamExistsByName(this.state.name)
            .then(exists => this.setState({exists: exists})), 350);

    handleInputChange = attributeName => e => {
        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        this.setState({[attributeName]: value});
    };

    cancel = e => {
        stop(e);
        if (confirm(I18n.t("new_team.cancel_confirmation"))) {
            this.props.history.replace("/my-teams");
        }
    };

    submit = e => {
        stop(e);
        if (this.isValid()) {
            const teamProperties = {...this.state};
            ["initial", "format","exists","approval"].forEach(attr => delete teamProperties[attr]);

            saveTeam(teamProperties)
                .then(team => {
                    this.props.history.push(`/teams/${team.id}`);
                    setFlash(I18n.t("teams.flash", {name: team.name, action: I18n.t("teams.flash_created")}));
                })
                .catch(err => {
                    err.response.json().then(this.handleError);
                });
        }
    };

    isValid = () => this.state.format && !this.state.exists && this.state.approval && !isEmpty(this.state.name);

    handleError = json => {
        //console.log(json);
        return json ? true : false;
    };

    render() {
        const {currentUser} = this.props;
        const {
            name, description, personalNote, viewable, initial, format, exists,
            invitationMessage, email, approval
        } = this.state;
        const validName = format && !exists;

        return (
            <div className="new-team">
                <h2>{I18n.t("new_team.title")}</h2>
                <div className="card">
                    <section className="form-divider">
                        <label htmlFor="name">{I18n.t("new_team.name")}</label>
                        <em>{I18n.t("new_team.name_info")}</em>
                        <div className="validity-input-wrapper">
                            <input ref={ref => this.nameInput = ref}
                                   type="text" id="name" name="name" value={name}
                                   onChange={this.changeTeamName}/>
                            {(validName && !initial) && <i className="fa fa-check"></i>}
                            {(!validName && !initial) && <i className="fa fa-exclamation"></i>}
                        </div>

                        {(isEmpty(name) && !initial) &&
                        <em className="error">{I18n.t("new_team.required")}</em>}

                        {(!isEmpty(name) && !format && !initial) &&
                        <em className="error">{I18n.t("new_team.format_error")}</em>}

                        {(!isEmpty(name) && exists && !initial) &&
                        <em className="error">{I18n.t("new_team.already_exists_error")}</em>}
                    </section>
                    <section className="form-divider">
                        <label htmlFor="description">{I18n.t("new_team.description")}</label>
                        <em>{I18n.t("new_team.description_info")}</em>
                        <textarea id="description" name="description" value={description}
                                  rows={3}
                                  onChange={this.handleInputChange("description")}/>

                        <CheckBox name="viewable" value={viewable}
                                  onChange={this.handleInputChange("viewable")}
                                  info={I18n.t("new_team.viewable_info")}/>

                        <label htmlFor="personalNote">{I18n.t("new_team.personal_note")}</label>
                        <em>{I18n.t("new_team.personal_note_info")}</em>
                        <textarea id="personalNote" name="personalNote" value={personalNote}
                                  rows={3}
                                  onChange={this.handleInputChange("personalNote")}/>

                    </section>
                    <section className="form-divider">
                        <label htmlFor="admins">{I18n.t("new_team.admins")}</label>
                        <em>{I18n.t("new_team.admins_info")}</em>
                        <p className="current-user-name">{I18n.t("new_team.current_user", {name: currentUser.username})}</p>
                        <input type="text" id="email" name="email" value={email}
                               placeholder={I18n.t("new_team.admins_email_placeholder")}
                               onChange={this.handleInputChange("email")}/>
                        <label htmlFor="invitationMessage">{I18n.t("new_team.invitation_message")}</label>
                        <em>{I18n.t("new_team.invitation_message_info")}</em>
                        <textarea id="invitationMessage" name="invitationMessage" value={invitationMessage}
                                  rows={3}
                                  onChange={this.handleInputChange("invitationMessage")}/>


                    </section>
                    <CheckBox name="approval" value={approval}
                              onChange={this.handleInputChange("approval")}
                              info={I18n.t("new_team.share_info")}/>
                    {!approval && <em className="error">{I18n.t("new_team.approval_required")}</em>}

                    <a className="button grey" href="#" onClick={this.cancel}>
                        {I18n.t("new_team.cancel")}
                    </a>
                    <a className={`button ${this.isValid() ? "blue" : "grey"}`} href="#" onClick={this.submit}>
                        {I18n.t("new_team.submit")}
                    </a>
                </div>
            </div>
        );
    }
}

NewTeam.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};