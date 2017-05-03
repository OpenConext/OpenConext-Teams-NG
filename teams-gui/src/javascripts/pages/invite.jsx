import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EmailInput from "../components/email_input";
import InvitationInfo from "../components/invitation_info";
import DatePickerCustomInput from "../components/date_picker_custom";
import SelectLanguage from "../components/select_language";
import {invite, roleOfCurrentUserInTeam} from "../api";
import {handleServerError, setFlash} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";
import SelectRole from "../components/select_role";
import moment from "moment";

import {validEmailRegExp} from "../validations/regular_exp";

export default class Invite extends React.Component {

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
            language: "English",
            expiryDate: undefined,
            message: "",
            roleOfCurrentUserInTeam: "MANAGER"
        };
    }

    componentDidMount() {
        roleOfCurrentUserInTeam(this.props.match.params.teamId).then(role =>
            this.setState({roleOfCurrentUserInTeam: role.role}));
    }

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

    cancel = e => {
        stop(e);
        if (confirm(I18n.t("invite.cancel"))) {
            this.props.history.replace(`/teams/${this.props.match.params.teamId}`);
        }
    };

    submit = e => {
        stop(e);
        if (this.isValid()) {
            const {intendedRole, emails, expiryDate, message, csvEmails, language} = this.state;
            const teamId = this.props.match.params.teamId;
            invite({
                teamId,
                intendedRole,
                emails,
                expiryDate: expiryDate || null,
                message,
                csvEmails: csvEmails === false ? null : csvEmails,
                language
            })
                .then(() => {
                    this.props.history.push(`/teams/${teamId}`);
                    setFlash(I18n.t("invite.flash"));
                })
                .catch(err => handleServerError(err));
        }
    };

    isValid = () => !isEmpty(this.state.emails) || !isEmpty(this.state.csvEmails);

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

    renderInvitationRole = (intendedRole, roleOfCurrentUserInTeam) => {
        return (
            <section className="form-divider">
                <label className="invitation-role" htmlFor="invitationRole">{I18n.t("invite.role")}</label>
                <SelectRole onChange={this.handleInputChange("intendedRole")} role={intendedRole}
                            roleOfCurrentUserInTeam={roleOfCurrentUserInTeam}/>
            </section>
        );
    };

    renderInvitationLanguageExpiryDate = (language, expiryDate) => {
        return (
            <section className="screen-divider invitation-expiry-date">
                <div>
                    <label className="invitation-language"
                           htmlFor="invitationLanguage">{I18n.t("invite.invitation_language")}</label>
                    <SelectLanguage onChange={this.handleInputChange("language")} language={language}/>
                </div>
                <div>
                    <label className="expiry-date"
                           htmlFor="expiryDate">{I18n.t("invite.expiry_date")}</label>
                    <DatePicker selected={expiryDate}
                                isClearable={false}
                                onChange={this.handleInputChange("expiryDate")}
                                customInput={<DatePickerCustomInput clear={this.clearDate}/>}
                                minDate={moment().add(1, "days")}
                                locale={I18n.locale}/>
                </div>
            </section>
        );
    };

    renderInvitationMessage = message => {
        return (
            <section className="form-divider">
                <label className="invitation-message"
                       htmlFor="message">{I18n.t("invite.message")}</label>
                <em>{I18n.t("invite.message_info")}</em>
                <textarea id="message" name="message" value={message}
                          rows={5}
                          onChange={this.handleInputChange("message")}
                          placeholder={I18n.t("invite.message_placeholder")}/>
            </section>

        );
    };

    render() {
        const {
            emails, csvEmails, fileTypeError, fileName, intendedRole, language, expiryDate, message,
            roleOfCurrentUserInTeam, mailsImported
        } = this.state;

        return (
            <div className="invite">
                <h2>{I18n.t("invite.title")}</h2>
                <div className="card">
                    <section className="screen-divider">
                        <EmailInput emails={emails} emailRequired={csvEmails === false}
                                    onChangeEmails={this.onChangeEmails}
                                    multipleEmails={true} placeholder={I18n.t("invite.emails_placeholder")}
                                    autoFocus={true}/>
                        {this.renderEmailFile(fileName, fileTypeError, mailsImported)}
                        {this.renderInvitationRole(intendedRole, roleOfCurrentUserInTeam)}
                    </section>
                    <section className="screen-divider" style={{float: "right"}}>
                        <InvitationInfo locale={I18n.locale}/>
                    </section>
                    {this.renderInvitationLanguageExpiryDate(language, expiryDate)}
                    {this.renderInvitationMessage(message)}

                    <a className="button grey" href="#" onClick={this.cancel}>
                        {I18n.t("invite.cancel")}
                    </a>
                    <a className={`button ${this.isValid() ? "blue" : "grey"}`} href="#" onClick={this.submit}>
                        {I18n.t("invite.submit")}
                    </a>
                </div>
            </div>
        );
    }
}

Invite.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};