import I18n from "i18n-js";

export const stopEvent = e => {
    if (e !== undefined && e !== null) {
        e.preventDefault();
        e.stopPropagation();
    }
}

export const isEmpty = obj => {
    if (obj === undefined || obj === null) {
        return true;
    }
    if (Array.isArray(obj)) {
        return obj.length === 0;
    }
    if (typeof obj === "string") {
        return obj.trim().length === 0;
    }
    if (typeof obj === "object") {
        return Object.keys(obj).length === 0;
    }
    return false;
}

export const getDateString = timestamp => {
    const date = new Date(timestamp * 1000);
    const locale = I18n.locale === "en" ? "en-GB" : "nl-NL";
    return date.toLocaleString(locale, {day: "numeric", month: "long", year: "numeric"});
};
export const capitalize = s => {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
