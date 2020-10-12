import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";
import {stop} from "../utils/utils";
import {convertToHtml} from "../utils/markdown";

export default class TeamDescription extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: props.team.description || "",
            selectedTab: "write"
        };
        this.tabOptions = {
            "write": I18n.t("team_description.write"),
            "preview": I18n.t("team_description.preview")
        };
    }

    saveDescription = e => {
        stop(e);
        const {changeDescription} = this.props;
        const {value} = this.state;
        changeDescription(value);
    };

    render() {
        const {value, selectedTab} = this.state;
        const {team, readOnly} = this.props;
        return (
            <div className="team-description">
                <div className="actions">
                    <label className="title">{I18n.t("team_description.title")}</label>
                    {!readOnly && <a className="button" href="#"
                                     onClick={this.saveDescription}>{I18n.t("team_description.save")}
                        <i className="fa fa-floppy-o"/>
                    </a>}
                </div>
                {readOnly && <p className="mde-preview-content" dangerouslySetInnerHTML={{
                    __html: convertToHtml(value, true)
                }}/>}
                {!readOnly &&
                <label className="sub-title">{I18n.t("team_description.explanation", {name: team.name})}</label>}
                {!readOnly && <div className="container">
                    <ReactMde
                        toolbarCommands={[
                            ["header", "bold", "italic", "strikethrough"],
                            ["link", "quote", "code"],
                            ["unordered-list", "ordered-list"]
                        ]}
                        maxEditorHeight={60}
                        value={value}
                        l18n={this.tabOptions}
                        onChange={value => this.setState({value})}
                        selectedTab={selectedTab}
                        onTabChange={selectedTab => {
                            this.setState({selectedTab});
                        }}
                        generateMarkdownPreview={markdown =>
                            Promise.resolve(convertToHtml(markdown, true))
                        }
                    />
                </div>}
            </div>
        );
    }
}

TeamDescription.propTypes = {
    team: PropTypes.object,
    readOnly: PropTypes.bool,
    changeDescription: PropTypes.func
};

