import I18n from "i18n-js";
import {React, useEffect, useState} from "react";
import "./InvitationForm.scss";
import {Button} from "./Button";
import InputField from "./InputField";
import {getDateString} from "../utils/utils";
import ConfirmationDialog from "./ConfirmationDialog";
import {deleteInvitation, getInvitation, resendInvitation} from "../api";
import {setFlash} from "../flash/events";

export const InvitationForm = ({setShowForm, invitation, updateTeam}) => {

    const [invitationDetails, setInvitationDetails] = useState({});
    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getInvitation(invitation.id).then(res => {
            setInvitationDetails(res);
            setMessage(res.invitationMessages.sort((m1, m2) => m1.id < m2.id ? 1 : -1)[0].message)
        });
    }, [invitation]);

    const doDeleteInvitation = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doDeleteInvitation(false),
                warning: false,
                question: I18n.t(`teamDetails.confirmations.removeInvitation`),
            });
            setConfirmationOpen(true);
        } else {
            deleteInvitation(invitation.id).then(() => {
                setShowForm(false);
                updateTeam();
                setFlash(I18n.t("teamDetails.flash.removeInvitation"))
            });
        }
    }

    const doResendInvitation = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doResendInvitation(false),
                warning: false,
                question: I18n.t(`teamDetails.confirmations.resendInvitation`),
            });
            setConfirmationOpen(true);
        } else {
            resendInvitation({ id: invitation.id, message: message }).then(() => {
                setShowForm(false);
                updateTeam();
                window.scrollTo(0, 0);
                setFlash(I18n.t("teamDetails.flash.resendInvitation"));
            });
        }

    }

    return (
        <div className="invitation-form-container">
            {confirmationOpen && (
                <ConfirmationDialog
                    isOpen={confirmationOpen}
                    cancel={confirmation.cancel}
                    confirm={confirmation.action}
                    isWarning={confirmation.warning}
                    question={confirmation.question}
                />
            )}
            <div className="invitation-form-wrapper">
                <h3>{I18n.t("invitationForm.header")}</h3>
                <InputField
                    name={I18n.t("invitationForm.email")}
                    value={invitation.person.email}
                    disabled={true}
                />
                <InputField
                    name={I18n.t("invitationForm.created")}
                    value={getDateString(invitation.created)}
                    disabled={true}
                />
                <InputField
                    name={I18n.t("invitationForm.role")}
                    value={I18n.t(`roles.${invitation.role.toLowerCase()}`)}
                    disabled={true}
                />
                <InputField
                    name={I18n.t("invitationForm.language")}
                    value={I18n.t(`languages.${invitationDetails.language}`)}
                    disabled={true}
                />
                <InputField
                    name={I18n.t("invitationForm.message")}
                    value={message}
                    multiline={true}
                    placeholder={I18n.t("invitationForm.messagePlaceholder")}
                    onChange={e => setMessage(e.target.value)}
                />
                <div className="submit-button-wrapper">
                    <Button
                        onClick={() => doDeleteInvitation(true)}
                        deleteButton={true}
                    />
                    <Button
                        onClick={() => setShowForm(false)}
                        className={"cancel-invitation"}
                        txt={I18n.t("forms.cancel")}
                        cancelButton={true}
                    />
                    <Button
                        onClick={() => doResendInvitation(true)}
                        txt={I18n.t("forms.resend")}
                    />
                </div>
            </div>
        </div>
    );
};
