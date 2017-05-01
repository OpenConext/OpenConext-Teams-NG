import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";

import debounce from "lodash/debounce";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import PersonAutocomplete from "../components/person_autocomplete";
import InvitationInfo from "../components/invitation_info";
import DatePickerCustomInput from "../components/date_picker_custom";
import SelectLanguage from "../components/select_language";
import {autoCompletePerson, invite} from "../api";
import {setFlash, handleServerError} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";
import SelectRole from "../components/select_role";

const validEmailRegExp = /^\S+@\S+$/;

export default class Invite extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            initial: true,
            emails: [],
            email: "",
            csvEmails: undefined,
            fileTypeError: false,
            fileName: "",
            fileInputKey: new Date().getMilliseconds(),
            intendedRole: "MEMBER",
            language: "English",
            expiryDate: undefined,
            message: "",
            suggestions: [],
            selectedPerson: -1
        };
    }

    componentDidMount() {
        this.emailInput.focus();
    }

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

    handleFile = e => {
        const files  = e.target.files;

        if (!isEmpty(files)) {
            const file = files[0];
            if (file.name.endsWith("csv")) {
                const reader = new FileReader();
                reader.onload = () => {
                    const csvEmails = reader.result;
                    this.setState({fileName: file.name,fileTypeError: false, csvEmails: csvEmails});
                };
                reader.readAsText(file);
            } else {
                this.setState({fileTypeError: true});
            }
        }

    };

    cancel = e => {
        stop(e);
        if (confirm(I18n.t("invite.cancel"))) {
            this.props.history.replace(`/teams/${this.props.match.params.id}`);
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
                csvEmails,
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

    validateEmail = e => {
        stop(e);
        this.setState({initial: false});
        const email = e.target.value;
        if (!isEmpty(email) && validEmailRegExp.test(email.trim())) {
            this.personSelected({email: email});
        }
    };

    autocomplete = e => {
        const email = e.target.value;
        this.setState({email: email, selectedPerson: -1});
        this.delayedAutocomplete();
    };

    delayedAutocomplete = debounce(() =>
        autoCompletePerson(this.state.email).then(results => this.setState({suggestions: results})), 200);

    onAutocompleteKeyDown = e => {
        const {suggestions, selectedPerson} = this.state;
        if (e.keyCode === 40 && selectedPerson < (suggestions.length - 1)) {
            stop(e);
            this.setState({selectedPerson: (selectedPerson + 1)});
        }
        if (e.keyCode === 38 && selectedPerson >= 0) {
            stop(e);
            this.setState({selectedPerson: (selectedPerson - 1)});
        }
        if (e.keyCode === 13 && selectedPerson >= 0) {
            stop(e);
            this.setState({selectedPerson: -1}, () => this.personSelected(suggestions[selectedPerson]));
        }
        if (e.keyCode === 27) {
            stop(e);
            this.setState({selectedPerson: -1, email: "", suggestions: []});
        }

    };

    personSelected = personAutocomplete => {
        const { emails } = this.state;
        const email = personAutocomplete.email.trim();
        if (emails.indexOf(email) < 0) {
            this.setState({email: "", emails: [...emails, email]});
        }

    };

    render() {
        const {
            initial, emails, email, csvEmails, fileTypeError, fileName, intendedRole, language, expiryDate, message, suggestions, selectedPerson
        } = this.state;
        const invalidEmailFormat = !initial && !isEmpty(email) && !validEmailRegExp.test(email);
        const inValidEmail = !initial && emails.length === 0 && isEmpty(csvEmails) && isEmpty(email);
        const showAutoCompletes = email.length > 2;

        return (
            <div className="invite">
                <h2>{I18n.t("invite.title")}</h2>
                <div className="card">
                    <section className="screen-divider">
                        <section className="form-divider">
                            <label htmlFor="email">{I18n.t("invite.email")}</label>
                            <div className="validity-input-wrapper">
                                <input ref={self => this.emailInput = self}
                                       placeholder={I18n.t("invite.emails_placeholder")}
                                       type="text"
                                       onChange={this.autocomplete}
                                       onBlur={this.validateEmail}
                                       value={email}
                                       onKeyDown={this.onAutocompleteKeyDown}/>
                                {initial && <i className="fa fa-search"></i>}
                                {showAutoCompletes && <PersonAutocomplete suggestions={suggestions}
                                                                          query={email}
                                                                          selectedPerson={selectedPerson}
                                                                          itemSelected={this.personSelected}/>
                                }
                                {(!invalidEmailFormat && !inValidEmail && !initial) && <i className="fa fa-check"></i>}
                                {(invalidEmailFormat || inValidEmail) && <i className="fa fa-exclamation"></i>}
                            </div>

                            {inValidEmail && <em className="error">{I18n.t("invite.email_required")}</em>}
                            {invalidEmailFormat && <em className="error">{I18n.t("invite.email_invalid")}</em>}

                            <div>
                                {emails.map(mail => <span key={mail} className="email_tag">{mail}</span>)}
                            </div>
                        </section>
                        <section className="form-divider">
                            <label className="email-files">{I18n.t("invite.file_import")}</label>
                            <input key={this.state.fileInputKey} type="file" id="emailFiles" name="emailFiles" accept="text/csv"
                                   style={{display: "none"}}
                                   onChange={this.handleFile}/>
                            <div className="validity-input-wrapper">
                                <label className="email-files-placeholder"
                                    htmlFor="emailFiles">{fileName || I18n.t("invite.file_placeholder")}</label>
                                {(!isEmpty(fileName) || fileTypeError) && <i className="fa fa-times"></i>}
                            </div>
                            {fileTypeError && <em className="error">{I18n.t("invite.file_extension_error")}</em>}
                        </section>
                        <section className="form-divider">
                            <label className="invitation-role" htmlFor="invitationRole">{I18n.t("invite.role")}</label>
                            <SelectRole onChange={this.handleInputChange("intendedRole")} role={intendedRole}/>
                        </section>
                    </section>
                    <section className="screen-divider" style={{float: "right"}}>
                        <InvitationInfo locale={I18n.locale}/>
                    </section>
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
                                        isClearable={true}
                                        onChange={this.handleInputChange("expiryDate")}
                                        customInput={<DatePickerCustomInput/>}
                                        locale={I18n.locale}/>
                        </div>
                    </section>
                    <section className="form-divider">
                        <label className="invitation-message"
                               htmlFor="message">{I18n.t("invite.message")}</label>
                        <em>{I18n.t("invite.message_info")}</em>
                        <textarea id="message" name="message" value={message}
                                  rows={5}
                                  onChange={this.handleInputChange("message")}
                                  placeholder={I18n.t("invite.message_placeholder")}/>
                    </section>

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
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};