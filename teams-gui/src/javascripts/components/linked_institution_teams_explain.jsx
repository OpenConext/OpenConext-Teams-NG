import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";

export default class LinkedInstitutionTeamsExplain extends React.Component {

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

    render() {
        const {close, productName, locale, isVisible} = this.props;
        const institutionName = I18n.t("linked_institution_example.institution_name");
        const institutionTeamName = I18n.t("linked_institution_example.institution_team_name");
        const surfName = I18n.t("linked_institution_example.surf_name");

        const explanation = locale === "en" ?
            <section className="explanation">
                <p>Your institutional teams are the teams provided by your institution to {productName} where you are a
                    member of.</p>
                <p>These teams can be linked to {productName} to allow for virtual memberships.</p>
            </section> :
            <section className="explanation">
                <p>Je institutie teams zijn de teams aangeleverd vanuit je institutie aan {productName} waar je lid van
                    bent.</p>
                <p>Deze teams kunnen worden gekoppeld aan {productName} om virtuele lidmaatschappen te realiseren.</p>
            </section>;

        const example = locale === "en" ?
            <section className="example">
                <p>Given the following memberships:</p>
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
                </div>
                <p>When the team <span className="emphasize">{institutionTeamName}</span> is linked to the team <span
                    className="emphasize">{surfName}</span> all members of <span
                    className="emphasize">{` ${institutionTeamName} `}</span>
                    will become virtual members of <span className="emphasize">{` ${surfName}`}</span>.</p>

                <p>As a result <span className="emphasize">Mary</span> is an implicit member of the team <span
                    className="emphasize">{surfName}</span>.
                    <span className="emphasize"> Joe</span> however did <span className="strong">not</span> became a
                    member of the
                    team <span className="emphasize">{institutionTeamName}</span> as the virtual membership is
                    unidirectional.
                </p>

            </section> :
            <section className="example">
                <p>Gegeven de volgende lidmaatschappen:</p>
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
                </div>
                <p>Als het team <span className="emphasize">{institutionTeamName}</span> wordt gekoppeld aan het team
                    <span
                        className="emphasize">{surfName}</span> dan worden alle leden van <span
                        className="emphasize">{` ${institutionTeamName} `}</span>
                    virtuele leden van <span className="emphasize">{` ${surfName}`}</span>.</p>

                <p>Ofwel <span className="emphasize">Mary</span> is een impliciet lid van het team <span
                    className="emphasize">{surfName}</span>.
                    <span className="emphasize"> Joe</span> daarentegen is <span className="strong">geen</span> lid
                    geworden van
                    team <span className="emphasize">{institutionTeamName}</span> aangezien de virtuele lidmaatschappen
                    unidirectioneel zijn.
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

