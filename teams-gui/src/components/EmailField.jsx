import React, {useState} from "react";
import "./EmailField.scss";
import {isEmpty, stopEvent} from "../utils/utils";
import {ReactComponent as TimesIcon} from "../icons/times.svg";
import Tooltip from "./Tooltip";
import {validEmailRegExp} from "../validations/regularExp";
import I18n from "i18n-js";

export const EmailField = ({
                               name,
                               emails,
                               addEmail,
                               removeMail,
                               toolTip,
                               placeHolder,
                               marginTop = true,
                               pinnedEmails = [],
                               error = false,
                               singleEmail = false,
                               disabled = false
                           }) => {

    const [email, setEmail] = useState("");
    const [errorMails, setErrorMails] = useState([]);
    const [hasFocus, setFocus] = useState(false);

    const updateEmail = e => {
        if (e.key !== "Tab") {
            setEmail(e.target.value);
            setErrorMails([]);
        }
    }

    const doAddEmail = e => {
        const delimiters = [",", " ", ";", "\n", "\t"];
        const newEmails = [];
        const newErrorEmails = [];
        if (!emails.map(m => m.toLowerCase()).includes(email.toLowerCase())) {
            if (!isEmpty(email) && delimiters.some(delimiter => email.indexOf(delimiter) > -1)) {
                email.replace(/[;\s]/g, ",").split(",")
                    .map(part => part.trim())
                    .filter(part => part.trim().length > 0)
                    .forEach(part => {
                        if (validEmailRegExp.test(part)) {
                            newEmails.push(part);
                        } else {
                            newErrorEmails.push(part);
                        }
                    });

            } else if (!isEmpty(email)) {
                const trimmedEmail = email.trim();
                if (validEmailRegExp.test(trimmedEmail)) {
                    newEmails.push(trimmedEmail);
                } else {
                    newErrorEmails.push(trimmedEmail)
                }
            }
        }
        //Corner case where Tab leads to addEmail and also onBlur
        if (e.type !== "blur" || newErrorEmails.length > 0) {
            setErrorMails(newErrorEmails);
        }
        setEmail("");
        addEmail([...new Set(newEmails)]);
    }

    return (
        <div className={`email-field ${error ? "error" : ""} ${marginTop ? "" : "no-margin-top"}`}>
            {(name && !toolTip) && <label htmlFor={"email-field"}>{name}</label>}
            {toolTip && <Tooltip tooltip={toolTip} name={name} label={name}/>}
            <div id="inner-email-field" className={`inner-email-field ${error ? "error" : ""} ${disabled ? "disabled" : ""} ${hasFocus ? "focus" : ""}`}>
                {emails.map(mail =>
                    <div key={mail} className="email-tag">
                        <span className="value">{mail}</span>
                        {!pinnedEmails.includes(mail) &&
                        <span className="action" onClick={removeMail(mail)}>
                                <TimesIcon/>
                            </span>}
                    </div>)}
                {(!singleEmail && !disabled) && <textarea id="email-field"
                                                          className={"email-field-textarea"}
                                                          value={email}
                                                          onChange={updateEmail}
                                                          onBlur={e => {
                                                              setFocus(false);
                                                              doAddEmail(e)}
                                                          }
                                                          onFocus={() => setFocus(true)}
                                                          onKeyDown={e => {
                                                              if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                                                                  doAddEmail(e);
                                                                  setTimeout(() => document.getElementById("email-field").focus(), 50);
                                                                  return stopEvent(e);
                                                              } else if (e.key === "Backspace" && isEmpty(email) && emails.length > 0) {
                                                                  setErrorMails([]);
                                                                  const mail = emails[emails.length - 1];
                                                                  if (!pinnedEmails.includes(mail)) {
                                                                      removeMail(mail)();
                                                                  }
                                                              } else if (e.key === "Tab") {
                                                                  doAddEmail(e);
                                                              }
                                                          }}
                                                          placeholder={emails.length === 0 ? placeHolder : ""}
                                                          cols={2}/>}
                {(singleEmail && !disabled) && <input type="email"
                                                      id="email-field"
                                                      value={email}
                                                      onFocus={() => setFocus(true)}
                                                      onChange={updateEmail}
                                                      onBlur={e => {
                                                          setFocus(false);
                                                          doAddEmail(e)
                                                      }}
                                                      onKeyDown={e => {
                                                          if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                                                              doAddEmail(e);
                                                              return e.key === "Enter" ? true : stopEvent(e);
                                                          } else if (e.key === "Backspace" && isEmpty(email) && emails.length > 0) {
                                                              const mail = emails[emails.length - 1];
                                                              setErrorMails([]);
                                                              if (!pinnedEmails.includes(mail)) {
                                                                  removeMail(mail)();
                                                              }
                                                          } else if (e.key === "Tab") {
                                                              doAddEmail(e);
                                                          }
                                                      }}
                                                      placeholder={emails.length === 0 ? placeHolder : ""}/>}
            </div>
            {errorMails.length > 0 &&
            <span className={"error"} aria-live="polite">
                {I18n.t(`emails.${errorMails.length === 1 ? "single" : "multiple"}Invalid`, {emails: errorMails.join(", ")})}
            </span>}
        </div>
    );
}
