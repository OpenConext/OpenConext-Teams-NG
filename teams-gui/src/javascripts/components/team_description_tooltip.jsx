import React from "react";
import PropTypes from "prop-types";
import {convertToHtml, convertToPlainText} from "../utils/markdown";
import {isEmpty} from "../utils/utils";
import ReactTooltip from "react-tooltip";

export default function TeamDescriptionTooltip({mdDescription, id}) {
    const description = convertToPlainText(mdDescription);
    if (isEmpty(description)) {
        return "";
    }
    if (description.length < 45) {
        return description;
    }
    const number = Math.min(description.substring(25).indexOf(" ") + 25, 50);
    const needsTooltip = description.length > 45;
    return (
        <span data-for={id} data-tip>
                {`${description.substring(0,number)}  `}
            {needsTooltip && <span>
            <i className="fa fa-info-circle"></i>
                <ReactTooltip id={id} type="light" class="tool-tip" effect="solid">
                    <span className="mde-preview-content" dangerouslySetInnerHTML={{
                        __html: convertToHtml(mdDescription)
                    }}/>
                </ReactTooltip>
                </span>}
            </span>
    );

}

TeamDescriptionTooltip.propTypes = {
    mdDescription: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
};


