import {convertToPlainText, convertToHtml} from "../../utils/markdown";

test("Convert to plain text", () => {
    const txt =  convertToPlainText("*bold*\n_italic_");
    expect(txt).toBe("bold italic");
});

test("Convert to html", () => {
    const html = convertToHtml("*bold*");
    expect(html).toBe("<p><em>bold</em></p>")
});
