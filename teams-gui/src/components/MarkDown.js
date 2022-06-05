import ReactMde from "react-mde";
import "./MarkDown.scss";
import {convertToHtml} from "../utils/markdown";
import {useState} from "react";
import I18n from "i18n-js";

export const MarkDown = ({markdown, onChange}) => {

    const [selectedTab, setSelectedTab] = useState("write");

    const tabOptions = {
        "write": I18n.t("teamDetails.markdownTabs.write"),
        "preview": I18n.t("teamDetails.markdownTabs.preview")
    };

    if (!onChange) {
        return <p className="mde-preview-content" dangerouslySetInnerHTML={{
            __html: convertToHtml(markdown, true)
        }}/>
    }

    return (
        <ReactMde
            toolbarCommands={[
                ["header", "bold", "italic", "strikethrough"],
                ["link", "quote", "code"],
                ["unordered-list", "ordered-list"]
            ]}
            maxEditorHeight={60}
            value={markdown}
            l18n={tabOptions}
            onChange={onChange}
            childProps={{textArea:{placeholder:I18n.t("teamDetails.markdownPlaceholder")}}}
            selectedTab={selectedTab}
            onTabChange={selectedTab => setSelectedTab(selectedTab)}
            generateMarkdownPreview={md => Promise.resolve(convertToHtml(md, true))}
        />)
}