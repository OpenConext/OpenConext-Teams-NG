import React, {useState} from "react";
import "./EmailField.scss";
import {isEmpty, stopEvent} from "../utils/utils";
import {ReactComponent as TimesIcon} from "../icons/times.svg";
import {ReactComponent as EnvelopeIcon} from "../icons/envelope.svg";
import Tooltip from "./Tooltip";
import {validEmailRegExp} from "../validations/regularExp";

export const EmailField = ({
                               name,
                               emails,
                               addEmail,
                               removeMail,
                               toolTip,
                               placeHolder,
                               marginTop = true,
                               pinnedEmails = [],
                               error = false
                           }) => {

    const [email, setEmail] = useState("");
    const doAddEmail = () => {
        const delimiters = [",", " ", ";", "\n", "\t"];
        const newEmails = [];
        if (!emails.map(m => m.toLowerCase()).includes(email.toLowerCase())) {
            if (!isEmpty(email) && delimiters.some(delimiter => email.indexOf(delimiter) > -1)) {
                const validEmails = email.replace(/[;\s]/g, ",").split(",")
                    .filter(part => part.trim().length > 0 && validEmailRegExp.test(part));
                newEmails.push(...validEmails);
            } else if (!isEmpty(email) && validEmailRegExp.test(email.trim())) {
                newEmails.push(email);
            }
        }
        setEmail("");
        addEmail([...new Set(newEmails)]);
    }

    return (
        <div className={`email-field ${error ? "error" : ""} ${marginTop ? "" : "no-margin-top"}`}>
            {(name && !toolTip) && <label htmlFor={name}>{name}</label>}
            {toolTip && <Tooltip tooltip={toolTip} name={name} label={name}/>}
            <div className={`inner-email-field ${error ? "error" : ""}`}>
                {emails.map(mail =>
                    <div key={mail} className="email-tag">
                        <span className="value">{mail}</span>
                        {pinnedEmails.includes(mail) ?
                            <span className="disabled">
                                <EnvelopeIcon/></span> :
                            <span className="action" onClick={removeMail(mail)}>
                                            <TimesIcon/>
                                        </span>}

                    </div>)}
                <textarea id="email-field" value={email} onChange={e => setEmail(e.target.value)} onBlur={doAddEmail}
                          onKeyDown={e => {
                              if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                                  doAddEmail(e);
                                  setTimeout(() => document.getElementById("email-field").focus(), 50);
                                  return stopEvent(e);
                              } else if (e.key === "Backspace" && isEmpty(email) && emails.length > 0) {
                                  const mail = emails[emails.length - 1];
                                  if (!pinnedEmails.includes(mail)) {
                                      removeMail(mail)();
                                  }
                              } else if (e.key === "Tab") {
                                  doAddEmail(e);
                              }
                          }}
                          placeholder={emails.length === 0 ? placeHolder : ""} cols={2}/>
            </div>
        </div>
    );
}
