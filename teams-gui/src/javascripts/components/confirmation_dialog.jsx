import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import I18n from "i18n-js";

export default function ConfirmationDialog({isOpen = false, cancel, confirm, question}) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={cancel}
            contentLabel={I18n.t("confirmation_dialog.title")}
            className="confirmation-dialog-content"
            overlayClassName="confirmation-dialog-overlay"
            closeTimeoutMS={250}>
            <section className="dialog-header">
                {I18n.t("confirmation_dialog.title")}
            </section>
            <section className="dialog-content">
                <h2>{question}</h2>
            </section>
            <section className="dialog-buttons">
                <a className="button grey" href="#" onClick={cancel}>
                    {I18n.t("confirmation_dialog.cancel")}
                </a>
                <a className="button blue" href="#" onClick={confirm}>
                    {I18n.t("confirmation_dialog.confirm")}
                </a>
            </section>
        </Modal>
    );

}

ConfirmationDialog.propTypes = {
    isOpen: PropTypes.bool,
    cancel: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired,
    question: PropTypes.string.isRequired,
};


