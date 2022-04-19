// Interpolation works as follows:
//
// Make a key with the translation and enclose the variable with {{}}
// ie "Hello {{name}}" Do not add any spaces around the variable name.
// Provide the values as: I18n.t("key", {name: "John Doe"})
import I18n from "i18n-js";

I18n.translations.en = {
    code: "EN",
    myteams: {
        title: "Title",
        members: "Members",
        empty: ""
    },
    profile: {
        admin: "Admin",
        guest: "Guest"
    },
    footer: {
        faq: "<a href='https://surf.nl' target='_blank' referrerpolicy='no-referrer'>FAQ</a>",
        terms: "<a href='https://surf.nl' target='_blank' referrerpolicy='no-referrer'>Terms of use</a>",
        privacy: "<a href='https://surf.nl' target='_blank' referrerpolicy='no-referrer'>Privacy policy</a>",
        powered: "Proudly powered by",
        surf: "<a href='https://surf.nl' target='_blank' referrerpolicy='no-referrer'>SURF</a>",
    }
};

export default I18n.translations.en;
