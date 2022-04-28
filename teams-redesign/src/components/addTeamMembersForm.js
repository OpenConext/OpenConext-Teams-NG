import I18n from "i18n-js";
import {useState, React} from "react";
import {ROLES} from "../utils/roles";
import "./addTeamMembersForm.scss";
import {Button} from "./Button";
import {ReactComponent as BinIcon} from "../icons/bin-1.svg";
import {DropDownMenu} from "./DropDownMenu";
import ErrorIndicator from "./ErrorIndicator";
import InputField from "./InputField";

export const AddTeamMembersForm = (team) => {
    const [emailInput, setEmailInput] = useState("");
    const [emails, setEmails] = useState([]);
    const [badEmails, setBadEmails] = useState([]);
    const [emailsSubmitted, setEmailsSubmitted] = useState(false);
    const [addedEmails, setAddedEmails] = useState([]);
    const [invitations, setInvitations] = useState([]);

    const validateEmailInput = (emailString) => {
        const pendingEmails = emailString.replaceAll(" ", "").split(",");
        const invalidEmails = pendingEmails.filter((email) => {
            var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return !re.test(email);
        });
        if (invalidEmails.length > 0) {
            setBadEmails(invalidEmails);
            return;
        }
        setEmails(pendingEmails);
        setBadEmails([]);
    };

    const addEmails = () => {
        if (emails.length > 0 && badEmails.length < 1) {
            const uniqueEmails = [...new Set(emails.concat(addedEmails))];
            const pendingInvitations = uniqueEmails.map(email => {
                return ({email: email, role: ROLES.MEMBER})
            });
            setInvitations(pendingInvitations)
            setAddedEmails(uniqueEmails)
            setEmailsSubmitted(false);
            setEmailInput("");
            setEmails([]);
            setBadEmails([]);
        } else {
            setEmailsSubmitted(true);
        }
    };

    const getRoleActions = (invitationIndex) => {
        return [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER].map((role) => {
                return {
                    name: role,
                    action: () => {
                        const newInvitations = [...invitations];
                        newInvitations[invitationIndex].role = role;
                        setInvitations(newInvitations);
                    }
                }
            }
        )
    }
    return (
        <div className="add-members-form-container">
            <div className="add-emails-wrapper">
                <h3>{I18n.t("teamDetails.addMembers.fields.addMembers")}</h3>
                <span>
                    <InputField
                        value={emailInput}
                        onChange={(e) => {
                            setEmailInput(e.target.value);
                            setEmailsSubmitted(false);
                        }}
                        placeholder={I18n.t("teamDetails.addMembers.placeholders.emails")}
                        onBlur={(e) => validateEmailInput(e.target.value)}
                        error={
                            badEmails.length > 0 || (emailInput.length < 1 && emailsSubmitted)
                        }
                    />
                    <Button
                        className="add-emails-button"
                        txt={I18n.t("teamDetails.addMembers.add")}
                        onClick={addEmails}
                    />
                </span>
                {emails.length < 1 && emailsSubmitted && (
                    <ErrorIndicator
                        msg={I18n.t("forms.required", {
                            attribute: I18n.t("newTeam.name"),
                        })}
                    />
                )}
                {badEmails.length > 0 && emailInput.length > 0 && (
                    <ErrorIndicator msg={"teamDetails.addMembers.invalidEmails"}/>
                )}
            </div>

            {invitations.length > 0 && <div className="configure-roles-wrapper">
                <h3>{I18n.t("teamDetails.addMembers.fields.addRoles")}</h3>
                <ul>
                    {invitations.map((invitation, index) => {
                        return <li key={index}>
                            <label className="email-label">{invitation.email}</label>
                            <DropDownMenu title={invitation.role} actions={getRoleActions(index)}/>
                            <label
                                className="bin-button"
                                onClick={e => {
                                    const newInvitations = [...invitations];
                                    const newEmails = addedEmails.filter(email => email != invitation.email)
                                    newInvitations.splice(index, 1);
                                    setInvitations(newInvitations);
                                    setAddedEmails(newEmails);
                                }}>
                                <BinIcon/>
                            </label>
                        </li>
                    })}
                </ul>
            </div>}
            <div className="extra-info-wrapper">
                <h3>{I18n.t("teamDetails.addMembers.fields.extraInfo")}</h3>
            </div>
        </div>
    );
};
