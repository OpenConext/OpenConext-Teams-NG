import React from "react";
import PropTypes from "prop-types";


export default function InviteResentInfo({locale = "en"}) {
    return locale === "en" ?
        <div className="invitation_info">
            <p className="info">Sent a reminder mail to the invitee. </p>
            <span className="by-file">You can only change the personal message when resending an invite.</span>
        </div> : locale === "nl" ?
            <div className="invitation_info">
                <p className="info">Verstuur een herrineringsmail naar de uitgenodigde.</p>
                <p className="by-file">Je kan alleen de persoonlijke boodschap veranderen bij het versturen van email
                    herrineringen.</p>
            </div> :
            <div className="invitation_info">
                <p className="info">Enviou um lembrete para o convidado. </p>
                <span className="by-file">Você só pode alterar a mensagem pessoal ao reenviar um convite.</span>
            </div>;

}

InviteResentInfo.propTypes = {
    locale: PropTypes.string.isRequired
};

