import I18n from "i18n-js";

export const ROLES = {
    GUEST: "GUEST",
    MEMBER: "MEMBER",
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
    OWNER: "OWNER"
}
const getMembership = (team, user) => team.memberships.find(membership => membership.person.id === user.person.id);

export const getRole = (team, user) => {
    const membership = getMembership(team, user);
    if (!membership) {
        return ROLES.GUEST;
    }
    return ROLES[membership.role];
}

export const actionDropDownTitle = (team, user) => {
    const membership = getMembership(team, user);
    if (!membership) {
        return I18n.t("roles.title", {role: "guest"});
    }
    return I18n.t("roles.title", {role: membership.role.toLowerCase()});
}