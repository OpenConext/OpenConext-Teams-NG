import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";
import {NavLink} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmationDialog from "../components/confirmation_dialog";
import CheckBox from "../components/checkbox";
import {acceptInvitation, denyInvitation, getInvitationInfo} from "../api";
import {handleServerError, setFlash} from "../utils/flash";
import {goto, isEmpty, stop} from "../utils/utils";
import InvitationInfo from "../components/invitation_info";
import SelectRole from "../components/select_role";

export default class Invitation extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            invitation: {},
            loaded: false,
            approval: true,
            confirmationDialogOpen: false,
            confirmationDialogAction: () => {
                this.setState({confirmationDialogOpen: false});
                this.goBack();
            },
            confirmationQuestion: "",
            notFound: false
        };
    }

    componentDidMount() {
        const {key} = this.props.match.params;
        getInvitationInfo(key).then(invitation => this.setState({invitation: invitation, loaded: true}))
            .catch(err => {
                if (err.response.status === 404) {
                    this.setState({notFound: true, loaded: true});
                } else {
                    handleServerError(err);
                }

            });
        window.scrollTo(0, 0);
    }

    handleInputChange = attributeName => e => {
        const target = e.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        this.setState({[attributeName]: value});
    };

    goBack = () => goto("/my-teams", this.props);

    cancel = e => {
        stop(e);
        this.setState({confirmationDialogOpen: true, leavePage: true});
    };

    submit = action => e => {
        stop(e);
        if (this.isValid()) {
            const {key} = this.props.match.params;
            const promise = (action === "accept" ? acceptInvitation : denyInvitation);
            promise(key)
                .then(() => {
                    setFlash(I18n.t(`invitation.flash.${action}`, {name: this.state.invitation.teamName}));
                    goto(`/teams/${this.state.invitation.teamId}`);
                })
                .catch(err => handleServerError(err));
        }
    };

    isValid = () => {
        return this.state.approval;
    };

    renderTeam = invitation => {
        return (
            <section className="team">
                <label >{I18n.t("invitation.team.name")}</label>
                <input type="text" value={invitation.teamName} disabled="true"/>
                <label >{I18n.t("invitation.team.description")}</label>
                <input type="text" value={invitation.teamDescription} disabled="true"/>
                <section className="admins">
                    <label>{I18n.t("invitation.team.admins")}</label>
                    {invitation.admins.map((admin, index) =>
                        <div key={index}>
                            <input type="text" value={admin} disabled="true"/>
                        </div>
                    )}
                </section>
            </section>

        );
    };

    renderInvitationRole = intendedRole =>
        <section className="form-divider">
            <label>{I18n.t("invitation.team.role")}</label>
            <SelectRole onChange={() => 1} role={intendedRole} disabled={true}/>
        </section>;

    renderApproval = approval =>
        <section>
            <CheckBox name="approval" value={approval}
                      onChange={this.handleInputChange("approval")}
                      info={I18n.t("invitation.share_info")}
                      className={approval ? "checkbox" : "checkbox with-error"}/>
            {!approval && <em className="error with-checkbox">{I18n.t("invitation.approval_required")}</em>}
        </section>;

    renderInvitationMessage = message => {
        return (
            <section className="form-divider" style={{clear: "both"}}>
                <label className="invitation-message"
                       htmlFor="message">{I18n.t("invitation.message")}</label>
                <em>{I18n.t("invitation.message_info")}</em>
                <textarea id="message" name="message" value={message}
                          rows={5}
                          disabled="true"/>
            </section>
        );
    };

    renderInvalidInvitation = (invitation, notFound) => {
        const i18nMessage = notFound ? "not_found" : invitation.accepted ? "accepted" : invitation.expired ? "expired" :
            invitation.declined ? "declined" : invitation.alreadyMember ? "already_member" : "unknown";
        return <section className="invalid-invitation">
            <p>{I18n.t(`invitation.invalid.${i18nMessage}`)}
                {(!notFound && !invitation.alreadyMember) && <span>{I18n.t("invitation.invalid.join_request_1")}
                    <NavLink
                        to={`/join-requests/${invitation.teamId}`}>{I18n.t("invitation.invalid.join_request")}</NavLink>
                    {I18n.t("invitation.invalid.join_request_2")}
                </span>}
            </p>

        </section>;
    };

    renderValidInvitation = (invitation, approval, action) => {
        let approveClassName = "button";
        if (action === "accept" && this.isValid()) {
            approveClassName += " blue";
        }
        if (action === "deny") {
            approveClassName += " grey";
        }
        if (!this.isValid()) {
            approveClassName += " grey disabled";
        }
        return (
            <section>
                {this.renderApproval(approval)}
                <section className="buttons">
                    <a className="button" href="#" onClick={this.cancel}>
                        {I18n.t("invitation.cancel")}
                    </a>
                    <a className={`button ${action === "deny" ? "blue" : "grey"}`} href="#"
                       onClick={this.submit("deny")}>
                        {I18n.t("invitation.deny")}
                    </a>
                    <a className={approveClassName}
                       href="#"
                       onClick={this.submit("accept")}>
                        {I18n.t("invitation.accept")}
                    </a>
                </section>
            </section>
        );
    };

    render() {
        const {
            invitation, notFound, approval, loaded, confirmationDialogOpen, confirmationDialogAction,
            confirmationQuestion, leavePage
        } = this.state;
        if (!loaded) {
            return null;
        }
        const validInvitation = !notFound && !invitation.accepted && !invitation.expired && !invitation.declined
            && !invitation.alreadyMember;
        return (
            <div className="invitation">
                <ConfirmationDialog isOpen={confirmationDialogOpen}
                                    cancel={confirmationDialogAction}
                                    confirm={() => this.setState({confirmationDialogOpen: false})}
                                    question={confirmationQuestion}
                                    leavePage={leavePage}/>
                <h2>{I18n.t("invitation.title")}</h2>
                <div className={`card ${validInvitation ? "" : "with-invalid"}`}>
                    {!validInvitation && this.renderInvalidInvitation(invitation, notFound)}
                    {!notFound &&
                    <section>
                        <section className="screen-divider">
                            {this.renderTeam(invitation)}
                            {this.renderInvitationRole(invitation.intendedRole)}
                        </section>
                        <section className="screen-divider" style={{float: "right"}}>
                            <InvitationInfo locale={I18n.locale} invitation={invitation}/>
                        </section>
                        {!isEmpty(invitation.latestInvitationMessage.message) &&
                        this.renderInvitationMessage(invitation.latestInvitationMessage.message)}
                        {validInvitation && this.renderValidInvitation(invitation, approval, this.props.match.params.action) }
                    </section>}
                </div>
            </div>
        );
    }
}

Invitation.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};