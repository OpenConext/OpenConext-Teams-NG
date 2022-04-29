import I18n from "i18n-js";
import {useState, React} from "react";
import {ROLES} from "../utils/roles";
import "./addTeamMembersForm.scss";
import {Button} from "./Button";
import {FileUploadModal} from "./FileUploadModal";
import {ReactComponent as BinIcon} from "../icons/bin-1.svg";
import {DropDownMenu} from "./DropDownMenu";
import ErrorIndicator from "./ErrorIndicator";
import InputField from "./InputField";

export const AddTeamMembersForm = ({team, setShowForm}) => {
    const [emailInput, setEmailInput] = useState("");
    const [emails, setEmails] = useState([]);
    const [badEmails, setBadEmails] = useState([]);
    const [emailsSubmitted, setEmailsSubmitted] = useState(false);
    const [addedEmails, setAddedEmails] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [customMessage, setCustomMessage] = useState("");
    const [invitationLanguage, setInvitationLanguage] = useState("English");
    const [showFileUploadModal, setShowFileUploadModal] = useState(false);

    const validateEmailInput = (emailString) => {
        const pendingEmails = emailString
            .replaceAll(/(?:\r\n|\r|\n|\s)/g, ",")
            .split(",")
            .filter((email) => email.length > 0);
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

    const uploadFile = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            setEmailInput(result);
            validateEmailInput(result);
        };
        reader.readAsText(file);
    };

    const addEmails = () => {
        if (emails.length > 0 && badEmails.length < 1) {
            const uniqueEmails = [...new Set(emails.concat(addedEmails))];
            const pendingInvitations = uniqueEmails.map((email) => {
                return {email: email, role: ROLES.MEMBER};
            });
            setInvitations(pendingInvitations);
            setAddedEmails(uniqueEmails);
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
                },
            };
        });
    };

    const processSendInvitation = () => {
        //TODO!
        setShowForm(false);
    };

    return (
        <div className="add-members-form-container">
            <div className="add-emails-wrapper">
                <h3>{I18n.t("teamDetails.addMembers.headers.addMembersHeader")}</h3>
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
                  (badEmails.length > 0 || emailInput.length < 1) && emailsSubmitted
              }
          />
          <Button
              className="add-emails-button"
              txt={I18n.t("teamDetails.addMembers.buttons.addEmails")}
              onClick={addEmails}
          />
        </span>
                <span
                    className="upload-email-filelink"
                    onClick={() => {
                        setShowFileUploadModal(true);
                    }}
                >
          <small>{I18n.t("teamDetails.addMembers.uploadFile")}</small>
        </span>

                <FileUploadModal
                    isOpen={showFileUploadModal}
                    setIsOpen={setShowFileUploadModal}
                    acceptedTypes=".txt,.csv"
                    onCancel={() => setShowFileUploadModal(false)}
                    onFileUpload={uploadFile}
                />

                {emailInput.length < 1 && emailsSubmitted && (
                    <ErrorIndicator
                        msg={I18n.t("teamDetails.addMembers.errors.noInput")}
                    />
                )}
                {badEmails.length > 0 && emailInput.length > 0 && emailsSubmitted && (
                    <ErrorIndicator
                        msg={I18n.t("teamDetails.addMembers.errors.invalidEmails", {
                            attribute: badEmails.join(", "),
                        })}
                    />
                )}
            </div>

            {invitations.length > 0 && (
                <>
                    <div className="configure-roles-wrapper">
                        <h3>{I18n.t("teamDetails.addMembers.headers.addRolesHeader")}</h3>
                        <ul>
                            {invitations.map((invitation, index) => {
                                return (
                                    <li key={index}>
                                        <label className="email-label">{invitation.email}</label>
                                        <DropDownMenu
                                            title={invitation.role}
                                            actions={getRoleActions(index)}
                                        />
                                        <label
                                            className="bin-button"
                                            onClick={(e) => {
                                                const newInvitations = [...invitations];
                                                const newEmails = addedEmails.filter(
                                                    (email) => email != invitation.email
                                                );
                                                newInvitations.splice(index, 1);
                                                setInvitations(newInvitations);
                                                setAddedEmails(newEmails);
                                            }}
                                        >
                                            <BinIcon/>
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="extra-info-wrapper">
            <span className="extra-info-header">
              <h3>
                {I18n.t(
                    "teamDetails.addMembers.headers.additionalInformationHeader"
                )}
              </h3>
              <small>{I18n.t("teamDetails.addMembers.invitationExpiry")}</small>
            </span>
                        <textarea
                            className="custom-message-input"
                            type="textarea"
                            placeholder={I18n.t(
                                "teamDetails.addMembers.placeholders.customMessage"
                            )}
                            onChange={(e) => {
                                setCustomMessage(e.target.value);
                            }}
                            value={customMessage}
                        />
                    </div>
                    <div className="language-selection-wrapper">
                        <h3>
                            {I18n.t(
                                "teamDetails.addMembers.headers.invitationLanguageHeader"
                            )}
                        </h3>
                        <span
                            onChange={(e) => setInvitationLanguage(e.target.value)}
                            className="language-selection-buttons"
                        >
              <label>
                <input
                    type="radio"
                    value="English"
                    name="languageSelection"
                    checked={invitationLanguage === "English"}
                />
                  {I18n.t("teamDetails.addMembers.buttons.languageRadio.english")}
              </label>
              <label>
                <input
                    type="radio"
                    value="Dutch"
                    name="languageSelection"
                    checked={invitationLanguage === "Dutch"}
                />
                  {I18n.t("teamDetails.addMembers.buttons.languageRadio.dutch")}
              </label>
            </span>
                    </div>
                </>
            )}
            <span className="submit-button-wrapper">
        <Button
            onClick={() => setShowForm(false)}
            txt={I18n.t("teamDetails.addMembers.buttons.cancel")}
            className="cancel-button"
            cancelButton={true}
        />
                {invitations.length > 0 && (
                    <Button
                        onClick={processSendInvitation}
                        className="send-invite-button"
                        txt={I18n.t("teamDetails.addMembers.buttons.sendInvite")}
                    />
                )}
      </span>
        </div>
    );
};
