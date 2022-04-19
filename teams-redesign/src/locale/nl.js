// Interpolation works as follows:
//
// Make a key with the translation and enclose the variable with {{}}
// ie "Hello {{name}}" Do not add any spaces around the variable name.
// Provide the values as: I18n.t("key", {name: "John Doe"})
import I18n from "i18n-js";

I18n.translations.nl = {
    code: "NL",
    myteams: {
        title: "Title",
        members: "Members",
        empty: ""
    },
    profile: {
        admin: "Admin",
        guest: "Guest"
    }
};

export default I18n.translations.nl;
