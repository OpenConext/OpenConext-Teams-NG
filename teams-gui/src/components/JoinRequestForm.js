import I18n from "i18n-js";
import {React, useState} from "react";
import "./JoinRequestForm.scss";
import {Button} from "./Button";
import InputField from "./InputField";
import {getDateString} from "../utils/utils";
import ConfirmationDialog from "./ConfirmationDialog";
import {approveJoinRequest, deleteJoinRequest, rejectJoinRequest} from "../api";
import {setFlash} from "../flash/events";

export const JoinRequestForm = ({setShowForm, joinRequest, updateTeam}) => {

    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const doDeleteJoinRequest = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doDeleteJoinRequest(false),
                warning: false,
                question: I18n.t(`teamDetails.confirmations.removeJoinRequest`),
            });
            setConfirmationOpen(true);
        } else {
            deleteJoinRequest(joinRequest.id).then(() => {
                setShowForm(false);
                window.scrollTo(0, 0);
                updateTeam();
                setFlash(I18n.t("teamDetails.flash.removeJoinRequest"))
            });
        }
    }

    const doApproveJoinRequest = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doApproveJoinRequest(false),
                warning: false,
                question: I18n.t(`teamDetails.confirmations.approveJoinRequest`),
            });
            setConfirmationOpen(true);
        } else {
            approveJoinRequest(joinRequest.id).then(() => {
                setShowForm(false);
                updateTeam();
                window.scrollTo(0, 0);
                setFlash(I18n.t("teamDetails.flash.approveJoinRequest"));
            });
        }
    }

    const doRejectJoinRequest = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doRejectJoinRequest(false),
                warning: false,
                question: I18n.t(`teamDetails.confirmations.rejectJoinRequest`),
            });
            setConfirmationOpen(true);
        } else {
            rejectJoinRequest(joinRequest.id).then(() => {
                setShowForm(false);
                updateTeam();
                window.scrollTo(0, 0);
                setFlash(I18n.t("teamDetails.flash.rejectJoinRequest"));
            });
        }

    }

    return (
        <div className="join-request-form-container">
            {confirmationOpen && (
                <ConfirmationDialog
                    isOpen={confirmationOpen}
                    cancel={confirmation.cancel}
                    confirm={confirmation.action}
                    isWarning={confirmation.warning}
                    question={confirmation.question}
                />
            )}
            <div className="join-request-form-wrapper">
                <h3>{I18n.t("joinRequestForm.header")}</h3>
                <InputField
                    name={I18n.t("joinRequestForm.name")}
                    value={joinRequest.person.name}
                    disabled={true}
                />
                <InputField
                    name={I18n.t("joinRequestForm.email")}
                    value={joinRequest.person.email}
                    disabled={true}
                />
                <InputField
                    name={I18n.t("joinRequestForm.created")}
                    value={getDateString(joinRequest.created)}
                    disabled={true}
                />
                <InputField
                    name={I18n.t("joinRequestForm.message")}
                    value={joinRequest.message}
                    multiline={true}
                    disabled={true}
                />
                <div className="submit-button-wrapper">
                    <Button
                        onClick={() => doDeleteJoinRequest(true)}
                        deleteButton={true}
                    />
                    <Button
                        onClick={() => {
                            setShowForm(false);
                            window.scrollTo(0, 0);
                        }}
                        className={"cancel-join-request"}
                        txt={I18n.t("forms.cancel")}
                        cancelButton={true}
                    />
                    <Button
                        onClick={() => doRejectJoinRequest(true)}
                        cancelButton={true}
                        txt={I18n.t("forms.reject")}
                    />
                    <Button
                        onClick={() => doApproveJoinRequest(true)}
                        txt={I18n.t("forms.approve")}
                    />
                </div>
            </div>
        </div>
    );
};
