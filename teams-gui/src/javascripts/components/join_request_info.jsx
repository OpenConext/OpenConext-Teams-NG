import React from "react";
import PropTypes from "prop-types";


export default function JoinRequestInfo({team, locale = "en"}) {
    return locale === "en" ?
        <div className="join_request_info">
            <p className="info">The administrators of the {team.name} will receive an email with your request
                to join the {team.name}.</p>
            <p className="delete">You can at any time delete the join request from the 'My Teams' page.</p>
            <p className="email">After approval or rejection of your join request you will receive a email
                with the details.</p>
        </div> : locale === "nl" ?
            <div className="join_request_info">
                <p className="info">De administrators van {team.name} zullen een email ontvangen met daarin je verzoek
                    om
                    lid te worden van {team.name}.</p>
                <p className="delete">Je kan je verzoek om lid te worden elk moment verwijderen vanaf de 'Mijn Teams'
                    pagina.</p>
                <p className="email">Nadat je verzoek is goedgekeurd dan wel is if afgewezen ontvang je een email met
                    daarin de details.</p>
            </div> : <div className="join_request_info">
                <p className="info">
                    Os administradores do {team.name} receberão um email com sua solicitação
                    para se juntar ao {team.name}.</p>
                <p className="delete">
                    Você pode a qualquer momento excluir a solicitação de adesão da página 'Os Meus Grupos'.</p>
                <p className="email">
                    Após a aprovação ou rejeição do seu pedido de adesão, você receberá um email
                    com os detalhes.</p>
            </div>;

}

JoinRequestInfo.propTypes = {
    team: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired
};

