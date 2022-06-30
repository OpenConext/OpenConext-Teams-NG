import React from "react";
import Modal from "react-modal";
import I18n from "i18n-js";

import "./MissingAttributesDialog.scss";


export default function MissingAttributesDialog({missingAttributes, isOpen = false}) {
    return (
        <Modal
            isOpen={isOpen}
            contentLabel={I18n.t("missingAttributes.title")}
            className={"missing-attributes-modal"}
            overlayClassName="missing-attributes-overlay"
            closeTimeoutMS={125}
            ariaHideApp={false}>
            <section>
                {JSON.stringify(missingAttributes)}
            </section>
        </Modal>
    );

}

