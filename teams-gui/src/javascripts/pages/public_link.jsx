import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";
import {NavLink} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmationDialog from "../components/confirmation_dialog";
import CheckBox from "../components/checkbox";
import {acceptPublicLink, getPublicLink} from "../api";
import {setFlash} from "../utils/flash";
import {goto, stop} from "../utils/utils";
import PublicLinkInfo from "../components/public_link_info";
import SelectRole from "../components/select_role";
import {ROLES} from "../validations/memberships";

export default class PublicLink extends React.PureComponent {

    constructor(props, context) {
        super(props, context);
        this.state = {
            team: {},
            loaded: false,
            approval: true,
            confirmationDialogOpen: false,
            confirmationDialogAction: () => 1,
            cancelDialogAction: () => 1,
            confirmationQuestion: "",
            notFound: false
        };
    }

    componentDidMount() {
        const {key} = this.props.match.params;
        getPublicLink(key)
            .then(team => this.setState({team: team, loaded: true}))
            .catch(err => {
                if (err.response && err.response.status === 404) {
                    this.setState({notFound: true, loaded: true});
                } else {
                    throw err;
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
        this.setState({
            confirmationDialogOpen: true, leavePage: true,
            cancelDialogAction: () => {
                this.setState({confirmationDialogOpen: false});
                this.goBack();
            },
            confirmationDialogAction: () => this.setState({confirmationDialogOpen: false})
        });
    };

    submit = e => {
        stop(e);
        const {key} = this.props.match.params;
        if (this.isValid()) {
            acceptPublicLink(key)
                .then(() => {
                    this.setState({confirmationDialogOpen: false});
                    goto(`/teams/${this.state.team.id}`, this.props);
                    setFlash(I18n.t("public_link.flash.accept", {name: this.state.team.name}));
                });
        }
    };

    isValid = () => {
        return this.state.approval;
    };

    renderTeam = team => {
        return (
            <section className="team">
                <label >{I18n.t("public_link.team.name")}</label>
                <input type="text" value={team.name} disabled="true"/>
                <label >{I18n.t("public_link.team.description")}</label>
                <input type="text" value={team.description} disabled="true"/>
                <section className="admins">
                    <label>{I18n.t("public_link.team.admins")}</label>
                    {team.admins.map((admin, index) =>
                        <div key={index}>
                            <input type="text" value={`${admin.name} <${admin.email}>`} disabled="true"/>
                        </div>
                    )}
                </section>
            </section>

        );
    };

    renderPublicLinkRole = () =>
        <section className="form-divider">
            <label>{I18n.t("public_link.team.role")}</label>
            <SelectRole onChange={() => 1} role={ROLES.MEMBER.role} disabled={true}/>
        </section>;

    renderApproval = approval =>
        <section>
            <CheckBox name="approval" value={approval}
                      onChange={this.handleInputChange("approval")}
                      info={I18n.t("public_link.share_info")}
                      className={approval ? "checkbox" : "checkbox with-error"}/>
            {!approval && <em className="error with-checkbox">{I18n.t("public_link.approval_required")}</em>}
        </section>;

    renderInvalidPublicLink = (team, notFound) => {
        const i18nMessage = notFound ? "not_found" : team.alreadyMember ? "already_member" : "unknown";
        return <section className="invalid-invitation">
            <p>{I18n.t(`public_link.invalid.${i18nMessage}`)}
                {(!notFound && !team.alreadyMember) && <span>{I18n.t("public_link.invalid.join_request_1")}
                    <NavLink
                        to={`/join-requests/${team.id}`}>{I18n.t("public_link.invalid.join_request")}</NavLink>
                    {I18n.t("public_link.invalid.join_request_2")}
                </span>}
            </p>

        </section>;
    };

    renderValidPublicLink = (team, approval) => {
        let approveClassName = "button";
        if (this.isValid()) {
            approveClassName += " blue";
        }
        if (!this.isValid()) {
            approveClassName += " grey disabled";
        }
        return (
            <section>
                {this.renderApproval(approval)}
                <section className="buttons">
                    <a className="button" onClick={this.cancel}>
                        {I18n.t("public_link.cancel")}
                    </a>
                    <a className={approveClassName}
                       href="#"
                       onClick={this.submit}>
                        {I18n.t("public_link.accept")}
                    </a>
                </section>
            </section>
        );
    };

    render() {
        const {
            team, notFound, approval, loaded, confirmationDialogOpen, confirmationDialogAction,
            confirmationQuestion, cancelDialogAction, leavePage
        } = this.state;
        if (!loaded) {
            return null;
        }
        const validPublicLink = !notFound && !team.alreadyMember;
        const title = validPublicLink ? I18n.t("public_link.title", {name: team.name}) :
            I18n.t("public_link.invalid_title");
        return (
            <div className="invitation">
                <ConfirmationDialog isOpen={confirmationDialogOpen}
                                    cancel={cancelDialogAction}
                                    confirm={confirmationDialogAction}
                                    question={confirmationQuestion}
                                    leavePage={leavePage}/>
                <h2>{title}</h2>
                <div className={`card ${validPublicLink ? "" : "with-invalid"}`}>
                    {!validPublicLink && this.renderInvalidPublicLink(team, notFound)}
                    {!notFound &&
                    <section>
                        <section className="screen-divider">
                            {this.renderTeam(team)}
                            {this.renderPublicLinkRole()}
                        </section>
                        <section className="screen-divider" style={{float: "right"}}>
                            <PublicLinkInfo locale={I18n.locale} team={team}/>
                        </section>
                        {validPublicLink && this.renderValidPublicLink(team, approval) }
                    </section>}
                </div>
            </div>
        );
    }
}

PublicLink.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};