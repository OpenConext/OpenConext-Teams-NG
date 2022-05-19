import * as Showdown from "showdown";
import DOMPurify from "dompurify";
import removeMd from "remove-markdown";
import {isEmpty} from "./utils";

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

export function convertToHtml(markdown, openLinkInNewTab = false) {
    if (isEmpty(markdown)) {
        return markdown;
    }
    let html = DOMPurify.sanitize(converter.makeHtml(markdown));
    if (openLinkInNewTab) {
        html = html.replace(/<a /g, "<a target='_blank'");
    }
    return html;
}

export function convertToPlainText(markdown) {
    return removeMd(markdown).replace(/\n/g, " ");
}

