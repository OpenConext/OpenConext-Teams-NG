import React from "react";
import Modal from "react-modal";
import I18n from "i18n-js";

import "./TeamWelcomeDialog.scss";
import {Button} from "./Button";
import informational from "../icons/alert-information-circle.svg";
import rehypeSanitize from "rehype-sanitize";
import MDEditor from "@uiw/react-md-editor";

export default function TeamWelcomeDialog({team, invitation, accept, denied, isOpen = false,}) {
    const canBeAccepted = !invitation.alreadyMember && !invitation.expired;
    return (
        <Modal
            isOpen={isOpen}
            contentLabel={I18n.t("teamWelcomeDialog.title", {name: team.name})}
            className={"team-welcome-modal"}
            overlayClassName="team-welcome-overlay"
            closeTimeoutMS={125}
            ariaHideApp={false}>
            <section className={"team-welcome-header"}>
                {canBeAccepted && <h2>{I18n.t("teamWelcomeDialog.title", {name: team.name})}</h2>}
                {!canBeAccepted && <h2>{I18n.t("teamWelcomeDialog.titleDenied", {name: team.name})}</h2>}
            </section>
            {canBeAccepted &&<section className={"team-welcome-role"}>
                {canBeAccepted && <>
                    <img src={informational} alt="info"/>
                    <span>{I18n.t("teamWelcomeDialog.header", {role: I18n.t(`roles.${invitation.intendedRole.toLowerCase()}`)})}</span>
                </>}
            </section>}
            <section className={"team-welcome-content"}>
                {canBeAccepted && <MDEditor.Markdown source={team.description} rehypePlugins={[[rehypeSanitize]]}/>}
                {invitation.expired && <p>{I18n.t("teamWelcomeDialog.expired")}</p>}
                {invitation.alreadyMember  && <p>{I18n.t("teamWelcomeDialog.alreadyMember")}</p>}
                <section className="team-welcome-buttons">
                    {canBeAccepted && <Button txt={I18n.t("teamWelcomeDialog.proceed")}
                                              onClick={() => accept()}
                                              className="orphan"/>}
                    {!canBeAccepted && <Button txt={I18n.t("teamWelcomeDialog.denied")}
                                               onClick={() => denied()}
                                               className="orphan"/>}
                </section>
            </section>
        </Modal>
    );

}

