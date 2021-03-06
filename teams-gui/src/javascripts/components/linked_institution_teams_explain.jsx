import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";

export default class LinkedInstitutionTeamsExplain extends React.PureComponent {

    componentWillReceiveProps(nextProps) {
        if (this.props.isVisible === false && nextProps.isVisible === true) {
            setTimeout(() => this.main.focus(), 50);
        }
    }

    institution = name => <span className="team">
        <i className="fa fa-building-o"></i><span>{name}</span>
    </span>;

    member = name => <span className="member">
        <i className="fa fa-user"></i><span>{name}</span>
    </span>;

    surf = productName => <span className="team">
        <i className="fa fa-users"></i><span>{productName}</span>
    </span>;

    organization = name => <span className="organization">{name}</span>

    memberships = (institutionName, institutionTeamName, productName, surfName) =>
        <div className="memberships">
            <div className="membership">
                {this.organization(institutionName)}
                {this.institution(institutionTeamName)}
                {this.member("Mary")}
            </div>
            <div className="membership">
                {this.organization(productName)}
                {this.surf(surfName)}
                {this.member("Joe")}
            </div>
        </div>;

    render() {
        const {close, productName, locale, isVisible} = this.props;
        const institutionName = I18n.t("linked_institution_example.institution_name");
        const institutionTeamName = I18n.t("linked_institution_example.institution_team_name");
        const surfName = I18n.t("linked_institution_example.surf_name");

        const explanation = locale === "en" ?
            <section className="explanation">
                <p>Your institutional Teams are the teams or groups provided by your institution to {productName}.
                    Only those you are a member of are shown.</p>
            </section> : locale === "nl" ?
                <section className="explanation">
                    <p>Je instellingsteams zijn de teams of groepen die vanuit je instelling aan {productName} worden
                        aangeleverd.
                        Alleen de Teams waar jij lid van bent worden getoond.</p>
                </section> : <section className="explanation">
                    <p>Suas equipes institucionais são as equipes ou grupos fornecidos por sua instituição
                        para {productName}.
                        Somente aqueles dos quais você é membro são exibidos.</p>
                </section>;

        const details = locale === "en" ?
            <section className="details">
                You can link these institutional Teams to any Team you manage within {productName}.
                By doing so, the {productName} team will contain all members who have individually joined this Team
                directly,
                plus all members who already belong to the institutional Team. This creates virtual memberships.
                Consider the example below.
            </section> : locale === "nl" ?
                <section className="details">
                    Je kunt deze Teams koppelen aan een Team dat je binnen {productName} beheert.
                    Hierdoor zal het {productName} team niet alleen de leden bevatten die rechtstreeks zijn lid
                    geworden,
                    maar ook alle leden van het Team van je instelling. Hierdoor ontstaan er als het ware virtuele
                    lidmaatschappen. Bekijk het voorbeeld hieronder.
                </section> : <section className="details">
                    Você pode vincular essas equipes institucionais a qualquer equipe que você gerencia em {productName}.
                    Ao fazer isso, a equipe do {productName} conterá todos os membros que se juntaram a essa equipe
                    individualmente
                    diretamente,
                    além de todos os membros que já pertencem à equipe institucional. Isso cria associações virtuais.
                    Considere o exemplo abaixo.
                </section>;

        const example = locale === "en" ?
            <section className="example">
                <p>Given the following memberships:</p>
                {this.memberships(institutionName, institutionTeamName, productName, surfName)}
                <p>When the (institutional) Team '<span className="emphasize">{institutionTeamName}</span>' is linked to
                    the ({productName}) Team '<span
                        className="emphasize">{surfName}</span>' all members of '<span
                        className="emphasize">{`${institutionTeamName}`}</span>'
                    will also become (indirect) members of '<span className="emphasize">{`${surfName}`}</span>'.</p>

                <p>As a result, '<span className="emphasize">Mary</span>' is also an (indirect) member of the Team
                    '<span
                        className="emphasize">{surfName}</span>'.
                    '<span className="emphasize">Joe</span>' however did <span className="strong">not</span> become a
                    member of the
                    Team '<span className="emphasize">{institutionTeamName}</span>' as the virtual membership
                    only goes one way. Only members from institutional Teams will be included in {productName};
                    not the other way around.
                </p>

            </section> : locale === "nl" ?
                <section className="example">
                    <p>Gegeven de volgende lidmaatschappen:</p>
                    {this.memberships(institutionName, institutionTeamName, productName, surfName)}
                    <p>Als het (instellings) Team '<span className="emphasize">{institutionTeamName}</span>'
                        wordt gekoppeld aan het ({productName}) Team
                        '<span className="emphasize">{surfName}</span>', dan worden alle leden van '<span
                            className="emphasize">{`${institutionTeamName}`}</span>' virtuele leden van
                        '<span className="emphasize">{`${surfName}`}</span>'.</p>

                    <p>Het resultaat is dus dat '<span className="emphasize">Mary</span>' ook (virtueel) lid wordt van
                        het
                        Team
                        '<span className="emphasize">{surfName}</span>'.
                        '<span className="emphasize">Joe</span>' daarentegen is <span className="strong">geen</span> lid
                        geworden van het Team '<span className="emphasize">{institutionTeamName}</span>',
                        aangezien de virtuele lidmaatschappen maar één kant opgaan. Alleen leden van een instellingsteam
                        kunnen op deze manier onderdeel worden van een {productName} team; niet andersom.
                    </p>

                </section> :
                <section className="example">
                    <p> Dadas as seguintes associações: </ p>
                    {this.memberships(institutionName, institutionTeamName, productName, surfName)}
                    <p> Quando a equipe (institucional) '<span className="emphasize">{institutionTeamName}</span>'
                        está vinculada a equipe ({productName}) '<span className="emphasize">{surfName}</ span>' todos
                        os membros de '<span className="emphasize">{`${institutionTeamName}`}</ span>'
                        também se tornará membros (indiretos) de '<span className="emphasize"> {`${surfName}`} </ span>'.
                    </ p>

                    <p> Como resultado, '<span className="emphasize">Mary</span>' também é um membro (indireto) da
                        equipe '<span className="emphasize">{surfName}</ span>'.
                        '<span className="emphasize">Joe</ span>' no entanto <span className="strong">não</span> tornou-se um
                        membro de Equipa '<span className="emphasize">{`${institutionTeamName}`}</ span>' como membro virtual
                        só vai para um lado. Somente membros de equipes institucionais serão incluídos em {productName};
                        Não o contrário.
                    </p>

                </section>;

        const className = isVisible ? "" : "hide";
        return (
            <div className={`linked-institution-teams-explain ${className}`}
                 tabIndex="1" onBlur={close} ref={ref => this.main = ref}>
                <section className="container">
                    <section className="title">
                        <p>{I18n.t("linked_institution_example.title")}</p>
                        <a className="close" onClick={close}>
                            <i className="fa fa-remove"></i>
                        </a>
                    </section>
                    {explanation}
                    {details}
                    {example}
                </section>
            </div>
        );
    }
}

LinkedInstitutionTeamsExplain.propTypes = {
    close: PropTypes.func.isRequired,
    productName: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    isVisible: PropTypes.bool.isRequired
};

