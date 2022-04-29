import I18n from "i18n-js";
import React, {useState} from "react";
import Modal from "react-modal";
import {Button} from "./Button";
import "./FileUploadModal.scss";

export const FileUploadModal = ({
                                    isOpen,
                                    setIsOpen,
                                    acceptedTypes = "",
                                    onCancel,
                                    onFileUpload,
                                }) => {
    const [uploadedFile, setUploadedFile] = useState({name: ""});
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onCancel}
            contentLabel={I18n.t("fileUploadDialog.title")}
            className={"file-upload-dialog-content"}
            overlayClassName="file-upload-dialog-overlay"
            closeTimeoutMS={200}
            ariaHideApp={false}
        >
            <section className={"dialog-header"}>
                {I18n.t("fileUploadDialog.title")}
            </section>
            <section className="dialog-content">
                <input
                    type="file"
                    accept={acceptedTypes}
                    onChange={(e) => setUploadedFile(e.target.files[0])}
                    className="file-input"
                />
            </section>
            <section className="dialog-buttons">
                {onCancel && (
                    <Button
                        cancelButton={true}
                        txt={I18n.t("fileUploadDialog.buttons.cancel")}
                        onClick={onCancel}
                    />
                )}
                {uploadedFile.name != "" && (
                    <Button
                        txt={I18n.t("fileUploadDialog.buttons.upload")}
                        onClick={() => {
                            onFileUpload(uploadedFile);
                            setIsOpen(false);
                        }}
                    />
                )}
            </section>
        </Modal>
    );
};
