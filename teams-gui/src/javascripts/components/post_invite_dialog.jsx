import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import I18n from "i18n-js";
import {isEmpty, stop} from "../utils/utils";
import "react-mde/lib/styles/css/react-mde-all.css";
import DOMPurify from 'dompurify';
import * as Showdown from "showdown";

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

const sanitizeHtml = html => {
    if (isEmpty(html)) {
        return "";
    }
    return DOMPurify.sanitize(html);
};

export default function PostInviteDialog({isOpen = false, team, markdown, cancel}) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={cancel}
            contentLabel={I18n.t("post_invite_dialog.title", {name: team.name})}
            className="post-invite-dialog-content"
            overlayClassName="post-invite-dialog-overlay"
            closeTimeoutMS={250}
            ariaHideApp={false}>
            <section className="post-invite-header">
                {I18n.t("post_invite_dialog.title", {name: team.name})}
            </section>
            <div className="post-invite-content mde-preview">
                <div className="mde-preview-content">
                    <p dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(converter.makeHtml(markdown))
                    }}/>
                </div>
            </div>
            <section className="post-invite-buttons">
                <a className="button blue" onClick={e => {
                    stop(e);
                    cancel();
                }}>
                    {I18n.t("post_invite_dialog.close")}
                </a>
            </section>
        </Modal>
    );

}

PostInviteDialog.propTypes = {
    isOpen: PropTypes.bool,
    team: PropTypes.object,
    markdown: PropTypes.string,
    cancel: PropTypes.func.isRequired
};


