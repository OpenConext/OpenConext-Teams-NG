import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

import JoinRequestInfo from "../components/join_request_info";
import ConfirmationDialog from "../components/confirmation_dialog";
import CheckBox from "../components/checkbox";
import {getJoinRequest, getTeamDetail, joinRequest} from "../api";
import {handleServerError, setFlash} from "../utils/flash";
import {goto, isEmpty, stop} from "../utils/utils";


export default class JoinRequest extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            team: {},
            joinRequest: {},
            loaded: false,
            approval: true,
            message: "",
            confirmationDialogOpen: false,
            confirmationDialogAction: () => {
                this.setState({confirmationDialogOpen: false});
                this.goBack();
            }
        };
    }

    componentDidMount() {
        const {teamId, id} = this.props.match.params;
        getTeamDetail(teamId).then(team => {
            this.setState({team: team, loaded: isEmpty(id)});
            if (id) {
                getJoinRequest(id).then(joinRequest => this.setState({
                    joinRequest: joinRequest,
                    message: joinRequest.message,
                    loaded: true
                }));
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
        this.setState({confirmationDialogOpen: true});
    };

    submit = e => {
        stop(e);
        if (this.isValid()) {
            const {message} = this.state;
            const teamId = this.props.match.params.teamId;
            joinRequest({
                teamId,
                message
            }).then(() => {
                setFlash(I18n.t("join_request.flash", {name: this.state.team.name}));
                this.goBack();
            })
            .catch(err => handleServerError(err));
        }
    };

    isValid = () => {
        return this.state.approval;
    };

    renderTeam = team => {
        return (
            <section className="team">
                <label >{I18n.t("join_request.team.name")}</label>
                <input type="text" value={team.name} disabled="true"/>
                <label >{I18n.t("join_request.team.description")}</label>
                <input type="text" value={team.description} disabled="true"/>
                <section className="admins">
                    <label>{I18n.t("join_request.team.admins")}</label>
                    {team.admins.map((admin, index) =>
                        <div key={index}>
                            <input type="text" value={admin.name} disabled="true"/>
                        </div>
                    )}
                </section>
            </section>

        );
    };

    renderExistingJoinRequest = joinRequest => {
        if (isEmpty(joinRequest.id)) {
            return null;
        }
        return (
            <section className="form-divider previous-join-request">
                <label>{I18n.t("join_request.previous")}</label>
                <p>{I18n.t("join_request.previous_message", {date: moment.unix(joinRequest.created).format("LLL")})}</p>
            </section>
        );
    };

    renderApproval = approval =>
        <section>
            <CheckBox name="approval" value={approval}
                      onChange={this.handleInputChange("approval")}
                      info={I18n.t("join_request.share_info")}
                      className={approval ? "checkbox" : "checkbox with-error"}/>
            {!approval && <em className="error with-checkbox">{I18n.t("join_request.approval_required")}</em>}
        </section>;

    renderInvitationMessage = message => {
        return (
            <section className="form-divider" style={{clear: "both"}}>
                <label className="join-request-message"
                       htmlFor="message">{I18n.t("join_request.message")}</label>
                <em>{I18n.t("join_request.message_info")}</em>
                <textarea id="message" name="message" value={message}
                          rows={5}
                          onChange={this.handleInputChange("message")}
                          placeholder={I18n.t("join_request.message_placeholder")}/>
            </section>

        );
    };

    render() {
        const {team, joinRequest, message, approval, loaded, confirmationDialogOpen, confirmationDialogAction} = this.state;
        if (!loaded) {
            return null;
        }
        const valid = this.isValid();
        return (
            <div className="join-request">
                <ConfirmationDialog isOpen={confirmationDialogOpen}
                                    cancel={confirmationDialogAction}
                                    confirm={() => this.setState({confirmationDialogOpen: false})}
                                    leavePage={true}/>
                <h2>{I18n.t("join_request.title")}</h2>
                <div className="card">
                    <section className="screen-divider">
                        {this.renderTeam(team)}
                        {this.renderExistingJoinRequest(joinRequest)}
                    </section>
                    <section className="screen-divider" style={{float: "right"}}>
                        <JoinRequestInfo locale={I18n.locale} team={team}/>
                    </section>
                    {this.renderInvitationMessage(message)}
                    {this.renderApproval(approval)}
                    <section className="buttons">
                        <a className="button grey" href="#" onClick={this.cancel}>
                            {I18n.t("join_request.cancel")}
                        </a>
                        <a className={`button ${valid ? "blue" : "grey disabled"}`} href="#" onClick={this.submit}>
                            {isEmpty(joinRequest.id) ? I18n.t("join_request.submit") : I18n.t("join_request.resubmit")}
                        </a>
                    </section>
                </div>
            </div>
        );
    }
}

JoinRequest.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};