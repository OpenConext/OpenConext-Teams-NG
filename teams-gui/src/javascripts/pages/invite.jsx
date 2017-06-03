import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTooltip from "react-tooltip";

import EmailInput from "../components/email_input";
import ConfirmationDialog from "../components/confirmation_dialog";
import InviteInfo from "../components/invite_info";
import InviteResentInfo from "../components/invite_resent_info";
import DatePickerCustomInput from "../components/date_picker_custom";
import SelectLanguage from "../components/select_language";
import {getInvitation, invite, resendInvitation, roleOfCurrentUserInTeam} from "../api";
import { setFlash} from "../utils/flash";
import {goto, isEmpty, stop} from "../utils/utils";
import SelectRole from "../components/select_role";
import moment from "moment";

import {validEmailRegExp} from "../validations/regular_exp";

export default class Invite extends React.PureComponent {

    constructor(props, context) {
        super(props, context);
        this.state = {
            emails: [],
            csvEmails: false,
            mailsImported: 0,
            fileTypeError: false,
            fileName: "",
            fileInputKey: new Date().getMilliseconds(),
            intendedRole: "MEMBER",
            language: "ENGLISH",
            expiryDate: undefined,
            message: "",
            roleOfCurrentUserInTeam: "MANAGER",
            invitation: {},
            readOnly: false,
            confirmationDialogOpen: false,
            confirmationDialogAction: () => {
                this.setState({confirmationDialogOpen: false});
                this.goBack();
            }
        };
    }

    componentDidMount() {
        const {teamId, id} = this.props.match.params;
        roleOfCurrentUserInTeam(teamId).then(role => {
            this.setState({roleOfCurrentUserInTeam: role.role});
            if (!isEmpty(id)) {
                getInvitation(id).then(invitation => this.setState({
                    emails: [invitation.email],
                    intendedRole: invitation.intendedRole,
                    language: invitation.language,
                    expiryDate: invitation.expiryDate ? moment(invitation.expiryDate * 1000) : null,
                    message: invitation.invitationMessages.sort((m1, m2) => m1.id < m2.id ? 1 : -1)[0].message,
                    invitation: invitation,
                    readOnly: true,
                }));
            }
        });
        window.scrollTo(0, 0);
    }

    cancel = e => {
        stop(e);
        this.setState({confirmationDialogOpen: true});
    };

    onChangeEmails = emails => this.setState({emails: emails});

    handleInputChange = attributeName => e => {
        let value;
        if (!isEmpty(e) && isEmpty(e.target) && !isEmpty(e.value)) {
            value = e.value;
        } else if (isEmpty(e) || e._isAMomentObject) {
            value = e;
        } else {
            const target = e.target;
            value = target.type === "checkbox" ? target.checked : target.value;
        }
        this.setState({[attributeName]: value});
    };

    clearDate = () => {
        this.setState({expiryDate: null});
    };

    handleFile = e => {
        const files = e.target.files;

        if (!isEmpty(files)) {
            const file = files[0];
            if (file.name.endsWith("csv")) {
                const reader = new FileReader();
                reader.onload = () => {
                    const csvEmails = reader.result;
                    this.setState({
                        fileName: file.name, fileTypeError: false, csvEmails: csvEmails,
                        mailsImported: csvEmails.split(",").filter(mail => validEmailRegExp.test(mail.trim())).length
                    });
                };
                reader.readAsText(file);
            } else {
                this.setState({fileName: file.name, fileTypeError: true, csvEmails: false, mailsImported: 0});
            }
        }

    };

    goBack = () => goto(`/teams/${this.props.match.params.teamId}`, this.props);

    submit = e => {
        stop(e);
        if (this.isValid()) {
            const {intendedRole, emails, expiryDate, message, csvEmails, language, readOnly} = this.state;
            const {teamId, id} = this.props.match.params;
            const afterAction = () => {
                this.goBack();
                setFlash(I18n.t(readOnly ? "invite.flash_resent" : "invite.flash"));
            };
            if (readOnly) {
                resendInvitation({ id, message })
                    .then(afterAction);

            } else {
                invite({
                    teamId,
                    intendedRole,
                    emails,
                    expiryDate: expiryDate || null,
                    message,
                    csvEmails: csvEmails === false ? null : csvEmails,
                    language
                })
                    .then(afterAction);
            }
        }
    };

    isValid = () => {
        return !isEmpty(this.state.emails) || this.state.csvEmails;
    };

    resetFileInput = e => {
        stop(e);
        this.setState({
            csvEmails: false,
            fileTypeError: false,
            fileName: "",
            fileInputKey: new Date().getMilliseconds(),
            mailsImported: 0
        });
    };

    renderEmailFile = (fileName, fileTypeError, mailsImported) => {
        return (
            <section className="form-divider">
                <label>{I18n.t("invite.file_import")}</label>
                <input key={this.state.fileInputKey} type="file"
                       id="emailFiles" name="emailFiles"
                       accept="text/csv"
                       style={{display: "none"}}
                       onChange={this.handleFile}/>
                <div className="email-file-container">
                    <label tabIndex="0" onClick={e => e} htmlFor="emailFiles">
                        <span className="file-name">{fileName || I18n.t("invite.file_placeholder")}</span>
                        {(!isEmpty(fileName) || fileTypeError) &&
                        <span className="remove" onClick={this.resetFileInput}><i className="fa fa-remove"></i></span>}
                    </label>
                </div>
                {fileTypeError && <em className="error">{I18n.t("invite.file_extension_error")}</em>}
                {mailsImported > 0 &&
                <em>{I18n.t("invite.file_import_result", {nbr: mailsImported, fileName: fileName})}</em>}
            </section>
        );
    };

    renderInvitationRole = (intendedRole, roleOfCurrentUserInTeam, readOnly) => {
        return (
            <section className="form-divider">
                <label className="invitation-role" htmlFor="invitationRole">{I18n.t("invite.role")}</label>
                <SelectRole onChange={this.handleInputChange("intendedRole")} role={intendedRole}
                            roleOfCurrentUserInTeam={roleOfCurrentUserInTeam}
                            isCurrentUser={true}
                            disabled={readOnly}/>
            </section>
        );
    };

    renderInvitationLanguageExpiryDate = (language, expiryDate, readOnly) => {
        return (
            <section className="screen-divider invitation-expiry-date">
                <div>
                    <label className="invitation-language"
                           htmlFor="invitationLanguage">{I18n.t("invite.invitation_language")}</label>
                    <SelectLanguage onChange={this.handleInputChange("language")} language={language} disabled={readOnly} />
                </div>
                {this.props.currentUser.featureToggles["EXPIRY_DATE_MEMBERSHIP"] &&
                <div>
                    <div  className="expiry-date-container">
                        <label className="expiry-date"
                               htmlFor="expiryDate">{I18n.t("invite.expiry_date")}</label>
                        <i className="fa fa-info-circle" data-for="tool-tip-expiry-date" data-tip></i>
                    </div>
                    <ReactTooltip id="tool-tip-expiry-date"
                                  place="top">{I18n.t("invite.expiry_data_info")}</ReactTooltip>
                    <DatePicker selected={expiryDate}
                                isClearable={false}
                                onChange={this.handleInputChange("expiryDate")}
                                customInput={<DatePickerCustomInput clear={this.clearDate} disabled={readOnly}/>}
                                minDate={moment().add(1, "days")}
                                locale={I18n.locale}
                                disabled={readOnly}/>

                </div>}
            </section>
        );
    };

    renderInvitationMessage = message => {
        return (
            <section className="form-divider">
                <label className="invitation-message"
                       htmlFor="message">{I18n.t("invite.message")}</label>
                <em>{I18n.t("invite.message_info")}</em>
                <textarea id="message" name="message" value={message || ""}
                          rows={5}
                          onChange={this.handleInputChange("message")}
                          placeholder={I18n.t("invite.message_placeholder")}/>
            </section>

        );
    };

    render() {
        const {currentUser} = this.props;
        const {
            emails, csvEmails, fileTypeError, fileName, intendedRole, language, expiryDate, message,
            roleOfCurrentUserInTeam, mailsImported, readOnly, confirmationDialogOpen, confirmationDialogAction
        } = this.state;
        const valid = this.isValid();
        return (
            <div className="invite">
                <ConfirmationDialog isOpen={confirmationDialogOpen}
                                    cancel={confirmationDialogAction}
                                    confirm={() => this.setState({confirmationDialogOpen: false})}
                                    leavePage={true}/>
                <h2>{I18n.t("invite.title")}</h2>
                <div className="card">
                    <section className="screen-divider">
                        <EmailInput emails={emails} emailRequired={csvEmails === false}
                                    onChangeEmails={this.onChangeEmails}
                                    multipleEmails={true} placeholder={I18n.t("invite.emails_placeholder")}
                                    autoFocus={true}
                                    disabled={readOnly}
                                    currentUser={currentUser}/>
                        {!readOnly && this.renderEmailFile(fileName, fileTypeError, mailsImported)}
                        {this.renderInvitationRole(intendedRole, roleOfCurrentUserInTeam, readOnly)}
                    </section>
                    <section className="screen-divider" style={{float: "right"}}>
                        {readOnly ? <InviteResentInfo locale={I18n.locale}/> :
                            <InviteInfo locale={I18n.locale}
                                        personEmailPickerEnabled={currentUser.featureToggles["PERSON_EMAIL_PICKER"]}/>}
                    </section>
                    {this.renderInvitationLanguageExpiryDate(language, expiryDate, readOnly)}
                    {this.renderInvitationMessage(message)}
                    <section className="buttons">
                        <a className="button" href="#" onClick={this.cancel}>
                            {I18n.t("invite.cancel")}
                        </a>
                        <a className={`button ${valid ? "blue" : "grey disabled"}`} href="#" onClick={this.submit}>
                            {I18n.t("invite.submit")}
                        </a>
                    </section>
                </div>
            </div>
        );
    }
}

Invite.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};