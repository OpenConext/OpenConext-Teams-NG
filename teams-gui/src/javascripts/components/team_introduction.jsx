import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import {stop} from "../utils/utils";
import {saveIntroductionText} from "../api";
import {setFlash} from "../utils/flash";
import DOMPurify from "dompurify";

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

export default class TeamIntroduction extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: props.team.introductionText || "",
            selectedTab: "write"
        };
        this.tabOptions = {
            "write": I18n.t("team_introduction.write"),
            "preview": I18n.t("team_introduction.preview")
        };
    }

    saveIntroduction = e => {
        stop(e);
        const {team, refreshTeam} = this.props;
        const {value} = this.state;
        saveIntroductionText(team.id, value).then(team => {
            refreshTeam(team, false);
            setFlash(I18n.t("team_introduction.flash.saved", {name: team.name}));
        });
    };

    render() {
        const {value, selectedTab} = this.state;
        const {team} = this.props;
        return (
            <div className="team-introduction">
                <p className="info">{I18n.t("team_introduction.explanation", {name: team.name})}</p>
                <div className="container">
                    <ReactMde
                        toolbarCommands={[
                            ["header", "bold", "italic", "strikethrough"],
                            ["link", "quote", "code"],
                            ["unordered-list", "ordered-list"]
                        ]}
                        value={value}
                        l18n={this.tabOptions}
                        onChange={value => this.setState({value})}
                        selectedTab={selectedTab}
                        onTabChange={selectedTab => this.setState({selectedTab})}
                        generateMarkdownPreview={markdown =>
                            Promise.resolve(DOMPurify.sanitize(converter.makeHtml(markdown)))
                        }
                    />
                </div>
                <div className="actions">
                    <a className="button" href="#"
                       onClick={this.saveIntroduction}>{I18n.t("team_introduction.save")}
                        <i className="fa fa-floppy-o"/>
                    </a>
                </div>
            </div>
        );
    }
}

TeamIntroduction.propTypes = {
    team: PropTypes.object,
    refreshTeam: PropTypes.func
};

