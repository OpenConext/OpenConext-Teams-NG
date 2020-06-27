import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";

import debounce from "lodash/debounce";

import ConfirmationDialog from "../components/confirmation_dialog";
import EmailInput from "../components/email_input";
import SelectLanguage from "../components/select_language";
import CheckBox from "../components/checkbox";
import {saveTeam, teamExistsByName} from "../api";
import {setFlash} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";

import {validNameRegExp} from "../validations/regular_exp";
import SelectRole from "../components/select_role";
import {ROLES} from "../validations/memberships";
import {languageOptions} from "../constants/languages";

export default class NewTeam extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            name: "",
            description: "",
            personalNote: "",
            viewable: true,
            roleOfCurrentUser: ROLES.ADMIN.role,
            emails: {},
            invitationMessage: "",
            initial: true,
            format: true,
            exists: false,
            approval: true,
            language: languageOptions.find(option => option.code === I18n.locale),
            confirmationDialogOpen: false,
            confirmationDialogAction: () => {
                this.setState({confirmationDialogOpen: false});
                this.props.history.replace("/my-teams");
            }
        };
    }

    componentDidMount = () => this.nameInput.focus();

    cancel = e => {
        stop(e);
        this.setState({confirmationDialogOpen: true});
    };

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

    onChangeEmails = email => {
        if (!isEmpty(email)) {
            const currentEmails = this.state.emails;
            currentEmails[email[0]] = ROLES.ADMIN.role;
            this.setState({emails: currentEmails});
        }
    };

    handleInputChange = attributeName => e => {
        let value;
        if (isEmpty(e.target) && !isEmpty(e.value)) {
            value = e.value;
        } else {
            const target = e.target;
            value = target.type === "checkbox" ? target.checked : target.value;
        }
        this.setState({[attributeName]: value});
    };

    submit = e => {
        stop(e);
        if (this.isValid()) {
            const teamProperties = {...this.state};
            ["initial", "format", "exists", "approval"].forEach(attr => delete teamProperties[attr]);
            saveTeam(teamProperties)
                .then(team => {
                    this.props.history.push(`/teams/${team.id}`);
                    setFlash(I18n.t("teams.flash.team", {name: team.name, action: I18n.t("teams.flash.created")}));
                });
        }
    };

    isValid = () => this.state.format && !this.state.exists && this.state.approval &&
        !isEmpty(this.state.name);

    renderButtons = () =>
        <section className="buttons">
            <a className="button" href="#" onClick={this.cancel}>
                {I18n.t("new_team.cancel")}
            </a>
            <a className={`button ${this.isValid() ? "blue" : "grey disabled"}`} href="#" onClick={this.submit}>
                {I18n.t("new_team.submit")}
            </a>
        </section>;

    renderApproval = approval =>
        <section>
            <CheckBox name="approval" value={approval}
                      onChange={this.handleInputChange("approval")}
                      info={I18n.t("new_team.share_info")}
                      className={approval ? "checkbox" : "checkbox with-error"}/>
            {!approval && <em className="error with-checkbox">{I18n.t("new_team.approval_required")}</em>}
        </section>;

    changeRole = email => selectedRole => {
        const {emails} = this.state;
        emails[email] = selectedRole.value;
        this.setState({...emails});
    };

    deleteInvitee = email => () => {
        const {emails} = this.state;
        delete emails[email];
        this.setState({...emails});
    };

    renderEmailAndMessage = (currentUser, roleOfCurrentUser, emails, invitationMessage, language) => {
        return (
            <section className="form-divider">
                <label htmlFor="admins">{I18n.t("new_team.admins")}</label>
                <em>{I18n.t("new_team.admins_info")}</em>
                <div className="admin-owner-select">
                    <SelectRole onChange={selectedRole => this.setState({roleOfCurrentUser: selectedRole.value})}
                                role={roleOfCurrentUser} isOnlyAdmin={true} isCurrentUser={true}/>
                    <p className="current-user-name">{I18n.t("new_team.current_user", {name: currentUser.username})}</p>
                </div>
                {Object.keys(emails).map((email, index) =>
                    <div key={index} className="admin-owner-select">
                        <SelectRole onChange={this.changeRole(email)} role={emails[email]}
                                    roleOfCurrentUserInTeam={ROLES.ADMIN.role}/>
                        <p className="current-user-name deletable">{email}
                            <i className="fa fa-times" onClick={this.deleteInvitee(email)}></i>
                        </p>
                    </div>)
                }
                <EmailInput emails={[]}
                            emailRequired={false}
                            onChangeEmails={this.onChangeEmails}
                            multipleEmails={false}
                            clearAfterPersist={true}
                            placeholder={I18n.t("new_team.admins_email_placeholder")}
                            currentUser={currentUser}/>
                <label className="invitation-message"
                       htmlFor="invitationMessage">{I18n.t("new_team.invitation_message")}</label>
                <em>{I18n.t("new_team.invitation_message_info")}</em>
                <textarea id="invitationMessage" name="invitationMessage" value={invitationMessage}
                          rows={3}
                          onChange={this.handleInputChange("invitationMessage")}/>
                <label className="invitation-language"
                       htmlFor="invitationLanguage">{I18n.t("new_team.invitation_language")}</label>
                <SelectLanguage onChange={this.handleInputChange("language")} language={language}
                                supportedLanguageCodes={this.props.currentUser.config.supportedLanguageCodes}/>
            </section>
        );
    }


    renderDescriptionAndPersonalNote = (description, viewable, personalNote) =>
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
        </section>;


    renderName = (name, validName, initial, format, exists) =>
        <section className="form-divider">
            <label htmlFor="name">{I18n.t("new_team.name")}</label>
            <em>{I18n.t("new_team.name_info")}</em>
            <div className="validity-input-wrapper">
                <input ref={ref => this.nameInput = ref}
                       type="text" id="name" name="name" value={name}
                       onChange={this.changeTeamName}
                       onBlur={this.changeTeamName}/>
                {(validName && !initial) && <i className="fa fa-check"></i>}
                {(!validName && !initial) && <i className="fa fa-exclamation"></i>}
            </div>

            {(isEmpty(name) && !initial) &&
            <em className="error">{I18n.t("new_team.required")}</em>}

            {(!isEmpty(name) && !format && !initial) &&
            <em className="error">{I18n.t("new_team.format_error")}</em>}

            {(!isEmpty(name) && exists && !initial) &&
            <em className="error">{I18n.t("new_team.already_exists_error")}</em>}
        </section>;


    render() {
        const {currentUser} = this.props;
        const {
            name, description, personalNote, viewable, initial, format, exists, invitationMessage, emails, approval,
            language, confirmationDialogOpen, confirmationDialogAction, roleOfCurrentUser
        } = this.state;
        const validName = format && !exists;

        return (
            <div className="new-team">
                <ConfirmationDialog isOpen={confirmationDialogOpen}
                                    cancel={confirmationDialogAction}
                                    confirm={() => this.setState({confirmationDialogOpen: false})}
                                    leavePage={true}/>
                <h2>{I18n.t("new_team.title")}</h2>
                <div className="card">
                    {this.renderName(name, validName, initial, format, exists)}
                    {this.renderDescriptionAndPersonalNote(description, viewable, personalNote)}
                    {this.renderEmailAndMessage(currentUser, roleOfCurrentUser, emails, invitationMessage, language)}
                    {this.renderApproval(approval)}
                    {this.renderButtons()}
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