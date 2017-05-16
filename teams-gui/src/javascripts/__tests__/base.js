import I18n from "i18n-js";
import en from "../locale/en";
import nl from "../locale/nl";

const start = () => {
    expect(I18n).toBeDefined();
    expect(nl).toBeDefined();
    expect(en).toBeDefined();

    I18n.locale = "en";

};

export default start;