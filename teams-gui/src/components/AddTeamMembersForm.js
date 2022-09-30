import I18n from "i18n-js";
import {React, useState} from "react";
import "./AddTeamMembersForm.scss";
import {Button} from "./Button";
import {EmailField} from "./EmailField";
import {addDays, stopEvent} from "../utils/utils";
import Select from "react-select";
import {currentUserRoleInTeam, ROLES} from "../utils/roles";
import {invite} from "../api";
import {setFlash} from "../flash/events";
import {DateField} from "./DateField";
import Tooltip from "./Tooltip";


export const AddTeamMembersForm = ({team, user, setShowForm, updateTeam, isNewTeam, defaultRole}) => {

    const [emails, setEmails] = useState([]);
    const [role, setRole] = useState({value: defaultRole, label: I18n.t(`roles.${defaultRole.toLowerCase()}`)});
    const [customMessage, setCustomMessage] = useState("");
    const [invitationLanguage, setInvitationLanguage] = useState(I18n.t(`teamDetails.addMembers.buttons.languageCode.${I18n.locale}`));
    const [expiryDate, setExpiryDate] = useState(null);

    const roleOptions = () => {
        const role = currentUserRoleInTeam(team, user);
        if (role === ROLES.MANAGER) {
            return [ROLES.MEMBER].map(role => ({
                value: role,
                label: I18n.t(`roles.${role.toLowerCase()}`)
            }))
        }
        return [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.MEMBER].map(role => ({
            value: role,
            label: I18n.t(`roles.${role.toLowerCase()}`)
        }))
    }

    const processSendInvitation = () => {
        if (emails.length > 0) {
            const body = {
                teamId: team.id,
                intendedRole: role.value,
                emails,
                membershipExpiryDate: expiryDate,
                message: customMessage,
                language: invitationLanguage
            }
            invite(body).then(() => {
                setShowForm(false);
                updateTeam();
                setFlash(I18n.t("teamDetails.flash.sendInvitation"))
            });
        }

    };

    const addEmail = newEmails => {
        setEmails(emails.concat(newEmails));
    }
    const removeMail = email => e => {
        stopEvent(e);
        const newEmails = emails.filter(mail => mail !== email);
        setEmails(newEmails);
    };

    const onChangeRole = val => {
        setRole(val);
    }

    return (
        <form className="add-members-form-container" method={"POST"} onSubmit={stopEvent}>
            <h1>{I18n.t("teamDetails.addMembers.headers.title", {name: team.name})}</h1>
            <div className="add-emails-wrapper">
                <label className={"header"}
                       htmlFor={"email-field"}>{I18n.t("teamDetails.addMembers.headers.addMembersHeader")}</label>
                <EmailField emails={emails}
                            addEmail={addEmail}
                            removeMail={removeMail}
                            marginTop={false}
                            placeHolder={I18n.t("teamDetails.addMembers.placeholders.emails")}
                            pinnedEmails={[]}/>
            </div>
            <div className="add-emails-wrapper">
                <label className={"header"}
                       htmlFor={"select-role"}>{I18n.t("teamDetails.addMembers.headers.roleHeader")}</label>
                <Select className="select-role"
                        onChange={onChangeRole}
                        value={role}
                        id={"select-role"}
                        isDisabled={roleOptions().length === 1}
                        options={roleOptions()}
                />
            </div>
            <div className="extra-info-header">
                <label htmlFor={"custom-message-input"}
                    className={"header"}>{I18n.t("teamDetails.addMembers.headers.additionalInformationHeader")}</label>
                <small id={"invitation-expiry"}>{I18n.t("teamDetails.addMembers.invitationExpiry")}</small>
            </div>
            <textarea className="custom-message-input"
                      aria-describedby={"invitation-expiry"}
                      id={"custom-message-input"}
                      placeholder={I18n.t("teamDetails.addMembers.placeholders.customMessage")}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      value={customMessage}/>
            <div className="extra-info-header">
                <label className={"header"}>
                    {I18n.t("teamDetails.addMembers.expiryDate")}<Tooltip
                    tooltip={I18n.t("teamDetails.addMembers.expiryDateTooltip")}/>
                </label>
            </div>
            <DateField onChange={setExpiryDate}
                       value={expiryDate}
                       minDate={addDays(90)}/>
            <div className="language-selection-wrapper">
                <label className={"header"}>{I18n.t("teamDetails.addMembers.headers.invitationLanguageHeader")}</label>
                <div className="language-selection-buttons">
                        <input type="radio"
                               value="ENGLISH"
                               name="languageSelection"
                               onChange={e => setInvitationLanguage(e.target.value)}
                               checked={invitationLanguage === "ENGLISH"}/>
                        {I18n.t("teamDetails.addMembers.buttons.languageRadio.en")}
                        <input type="radio"
                               value="DUTCH"
                               onChange={e => setInvitationLanguage(e.target.value)}
                               name="languageSelection"
                               checked={invitationLanguage === "DUTCH"}/>
                        {I18n.t("teamDetails.addMembers.buttons.languageRadio.nl")}
                </div>
            </div>
            <div className="submit-button-wrapper">
                <Button
                    onClick={() => setShowForm(false)}
                    txt={I18n.t(`forms.${isNewTeam ? "skip" : "cancel"}`)}
                    className="cancel-button"
                    cancelButton={true}/>

                <Button
                    onClick={processSendInvitation}
                    className="send-invite-button"
                    disabled={emails.length === 0}
                    txt={I18n.t("teamDetails.addMembers.buttons.sendInvite")}/>

            </div>
        </form>
    );
};
