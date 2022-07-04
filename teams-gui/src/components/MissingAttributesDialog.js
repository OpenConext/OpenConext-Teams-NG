import React from "react";
import Modal from "react-modal";
import I18n from "i18n-js";

import "./MissingAttributesDialog.scss";
import {capitalize} from "../utils/utils";


export default function MissingAttributesDialog({missingAttributes, isOpen = false}) {
    return (
        <Modal
            isOpen={isOpen}
            contentLabel={I18n.t("missingAttributes.title")}
            className={"missing-attributes-modal"}
            overlayClassName="missing-attributes-overlay"
            closeTimeoutMS={125}
            ariaHideApp={false}>
            <section className={"missing-attributes-header"}>
                <h2>{I18n.t("missingAttributes.title")}</h2>
            </section>
            <section className={"missing-attributes-content"}>
                <p>{I18n.t("missingAttributes.missingAttribute", {productName: missingAttributes.config.productName})}</p>
                <p dangerouslySetInnerHTML={{
                    __html: I18n.t("missingAttributes.missingAttributeDescriptionHtml",
                        {
                            helpUrl: missingAttributes.config[`helpTos${capitalize(I18n.locale)}`],
                            productName: missingAttributes.config.productName
                        })
                }}/>
                <p className={"after-list"}>{I18n.t("missingAttributes.missingAttributesNotProvided")}</p>
                <ul>
                    {missingAttributes.missing_attributes.map(attr =>
                        <li key={attr}>{I18n.t(`missingAttributes.attributes.${attr}`)}</li>)}
                </ul>
            </section>
        </Modal>
    );

}

