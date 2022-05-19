import I18n from "i18n-js";
import {React, useState} from "react";
import "./AddTeamMembersForm.scss";
import {Button} from "./Button";
import {EmailField} from "./EmailField";
import {stopEvent} from "../utils/utils";
import Select from "react-select";
import {currentUserRoleInTeam, ROLES} from "../utils/roles";
import {invite} from "../api";
import {setFlash} from "../flash/events";


export const AddTeamMembersForm = ({team, user, setShowForm, updateTeam}) => {

    const [emails, setEmails] = useState([]);
    const [role, setRole] = useState({value: ROLES.MEMBER, label: I18n.t(`roles.${ROLES.MEMBER.toLowerCase()}`)});
    const [customMessage, setCustomMessage] = useState("");
    const [invitationLanguage, setInvitationLanguage] = useState(I18n.t(`teamDetails.addMembers.buttons.languageCode.${I18n.locale}`));

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
                expiryDate: null,
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
        <div className="add-members-form-container">
            <div className="add-emails-wrapper">
                <h3>{I18n.t("teamDetails.addMembers.headers.addMembersHeader")}</h3>
                <EmailField emails={emails}
                            addEmail={addEmail}
                            removeMail={removeMail}
                            marginTop={false}
                            placeHolder={I18n.t("teamDetails.addMembers.placeholders.emails")}
                            pinnedEmails={[]}/>
            </div>
            <div className="add-emails-wrapper">
                <h3>{I18n.t("teamDetails.addMembers.headers.roleHeader")}</h3>
                <Select className="select-role"
                        onChange={onChangeRole}
                        value={role}
                        isDisabled={roleOptions().length === 1}
                        options={roleOptions()}
                />
            </div>
            <div className="extra-info-header">
                <h3>{I18n.t("teamDetails.addMembers.headers.additionalInformationHeader")}</h3>
                <small>{I18n.t("teamDetails.addMembers.invitationExpiry")}</small>
            </div>
            <textarea className="custom-message-input"
                      placeholder={I18n.t("teamDetails.addMembers.placeholders.customMessage")}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      value={customMessage}/>
            <div className="language-selection-wrapper">
                <h3>{I18n.t("teamDetails.addMembers.headers.invitationLanguageHeader")}</h3>
                <div className="language-selection-buttons">
                    <label>
                        <input type="radio"
                               value="ENGLISH"
                               name="languageSelection"
                               onChange={e => setInvitationLanguage(e.target.value)}
                               checked={invitationLanguage === "ENGLISH"}/>
                        {I18n.t("teamDetails.addMembers.buttons.languageRadio.en")}
                    </label>
                    <label>
                        <input type="radio"
                               value="DUTCH"
                               onChange={e => setInvitationLanguage(e.target.value)}
                               name="languageSelection"
                               checked={invitationLanguage === "DUTCH"}/>
                        {I18n.t("teamDetails.addMembers.buttons.languageRadio.nl")}
                    </label>
                </div>
            </div>
            <div className="submit-button-wrapper">
                <Button
                    onClick={() => setShowForm(false)}
                    txt={I18n.t("forms.cancel")}
                    className="cancel-button"
                    cancelButton={true}/>

                <Button
                    onClick={processSendInvitation}
                    className="send-invite-button"
                    disabled={emails.length === 0}
                    txt={I18n.t("teamDetails.addMembers.buttons.sendInvite")}/>

            </div>
        </div>
    );
};
