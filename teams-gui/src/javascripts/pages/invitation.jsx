import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmationDialog from "../components/confirmation_dialog";
import CheckBox from "../components/checkbox";
import {acceptInvitation, denyInvitation, getInvitationInfo} from "../api";
import {handleServerError, setFlash} from "../utils/flash";
import {goto, stop} from "../utils/utils";
import InvitationInfo from "../components/invitation_info";

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
        getInvitationInfo(key).then(invitation => {
            this.setState({invitation: invitation, loaded: true});
        }).catch(() => this.setState({notFound: true}));
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
            const {key} = this.state;
            const promise = (action === "accept" ? acceptInvitation : denyInvitation);
            promise(key).then(() => {
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

    render() {
        const {
            invitation, notFound, approval, loaded, confirmationDialogOpen, confirmationDialogAction,
            confirmationQuestion, leavePage
        } = this.state;
        if (!loaded) {
            return null;
        }
        const valid = this.isValid();
        return (
            <div className="invitation">
                <ConfirmationDialog isOpen={confirmationDialogOpen}
                                    cancel={confirmationDialogAction}
                                    confirm={() => this.setState({confirmationDialogOpen: false})}
                                    question={confirmationQuestion}
                                    leavePage={leavePage}/>
                <h2>{I18n.t("invitation.title")}</h2>
                <div className="card">
                    {!notFound ?
                        <section>
                            <section className="screen-divider">
                                {this.renderTeam(invitation)}
                            </section>
                            <section className="screen-divider" style={{float: "right"}}>
                                <InvitationInfo locale={I18n.locale} invitation={invitation}/>
                            </section>
                            {this.renderInvitationMessage(invitation.latestInvitationMessage.message)}
                            {this.renderApproval(approval)}
                            <section className="buttons">
                                <a className="button grey" href="#" onClick={this.cancel}>
                                    {I18n.t("invitation.cancel")}
                                </a>
                                <a className="button grey" href="#" onClick={this.submit("deny")}>
                                    {I18n.t("invitation.deny")}
                                </a>
                                <a className={`button ${valid ? "blue" : "grey disabled"}`} href="#"
                                   onClick={this.submit("accept")}>
                                    {I18n.t("invitation.accept")}
                                </a>
                            </section>
                        </section> :
                        <section>
                            NOT FOUND
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