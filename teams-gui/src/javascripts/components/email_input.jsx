import React from "react";
import PropTypes from "prop-types";
import "react-select/dist/react-select.css";
import I18n from "i18n-js";

import debounce from "lodash/debounce";
import "react-datepicker/dist/react-datepicker.css";

import PersonAutocomplete from "../components/person_autocomplete";
import {autoCompletePerson} from "../api";
import {isEmpty, stop} from "../utils/utils";

import {validEmailRegExp} from "../validations/regular_exp";

export default class EmailInput extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            initial: true,
            email: "",
            suggestions: [],
            selectedPerson: -1,
        };
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.emailInput.focus();
        }
    }

    onFocus = () => {
        const {email} = this.state;
        if (isEmpty(email)) {
            this.setState({initial: true});
        }
    };

    validateEmail = e => {
        stop(e);
        this.setState({initial: false});
        const email = e.target.value;
        if (!isEmpty(email) && validEmailRegExp.test(email.trim())) {
            this.personSelected({email: email});
        } else {
            this.setState({suggestions: [], selectedPerson: -1, initial: isEmpty(email)});
        }
    };

    personSelected = personAutocomplete => {
        const {emails, onChangeEmails, multipleEmails} = this.props;
        const email = personAutocomplete.email;

        const newEmail = emails.indexOf(email) < 0;
        this.setState({email: multipleEmails ? "" : email, suggestions: [], selectedPerson: -1, initial: !newEmail});
        if (newEmail) {
            onChangeEmails([...emails, email]);
        }
    };

    removeMail = mail => e => {
        stop(e);
        const emails = [...this.props.emails];
        emails.splice(emails.indexOf(mail), 1);
        this.props.onChangeEmails(emails);
    };

    autocomplete = e => {
        const email = e.target.value;
        this.setState({email: email, selectedPerson: -1});
        if (isEmpty(email)) {
            this.setState({initial: true});
        } else if (email.trim().length > 1) {
            this.delayedAutocomplete();
        }
    };

    delayedAutocomplete = debounce(() =>
        autoCompletePerson(this.state.email).then(results => this.setState({suggestions: results})), 200);

    onAutocompleteKeyDown = e => {
        const {suggestions, selectedPerson} = this.state;
        if (e.keyCode === 40 && selectedPerson < (suggestions.length - 1)) {//keyDown
            stop(e);
            this.setState({selectedPerson: (selectedPerson + 1)});
        }
        if (e.keyCode === 38 && selectedPerson >= 0) {//keyUp
            stop(e);
            this.setState({selectedPerson: (selectedPerson - 1)});
        }
        if (e.keyCode === 13) {//enter
            if (selectedPerson >= 0) {
                stop(e);
                this.setState({selectedPerson: -1}, () => this.personSelected(suggestions[selectedPerson]));
            } else {
                this.validateEmail(e);
            }
        }
        if (e.keyCode === 27) {//escape
            stop(e);
            this.setState({initial: true, selectedPerson: -1, email: "", suggestions: []});
        }

    };

    render() {
        const {emails, emailRequired, multipleEmails, placeholder} = this.props;
        const {initial, email, suggestions, selectedPerson} = this.state;

        const invalidEmailFormat = !initial && !isEmpty(email) && !validEmailRegExp.test(email);
        const inValidEmail = !initial && emails.length === 0 && emailRequired && isEmpty(email);
        const showAutoCompletes = email.length > 1 && !isEmpty(suggestions);
        return (
            <section className="form-divider email-input">
                <label className="email-input-label" htmlFor="email">{I18n.t("invite.email")}</label>
                <div className="validity-input-wrapper">
                    <input ref={self => this.emailInput = self}
                           placeholder={placeholder}
                           type="text"
                           onChange={this.autocomplete}
                           onFocus={this.onFocus}
                           onBlur={this.validateEmail}
                           value={email}
                           onKeyDown={this.onAutocompleteKeyDown}
                           />
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

                {multipleEmails && <section className="email_tags">
                    {emails.map(mail =>
                        <div key={mail} className="email_tag">
                            <span>{mail}</span>
                            <span onClick={this.removeMail(mail)}><i className="fa fa-remove"></i></span>
                        </div>)}
                </section>}
            </section>
        );
    }

}

EmailInput.propTypes = {
    emails: PropTypes.array.isRequired,
    placeholder: PropTypes.string.isRequired,
    emailRequired: PropTypes.bool,
    onChangeEmails: PropTypes.func.isRequired,
    multipleEmails: PropTypes.bool,
    autoFocus: PropTypes.bool
};


