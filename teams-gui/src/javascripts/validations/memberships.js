import I18n from "i18n-js";

export const ROLES = {
    ADMIN : {icon: "fa fa-star", name: "admin", role: "ADMIN"},
    MANAGER: {icon: "fa fa-black-tie", name: "manager", role: "MANAGER"},
    MEMBER: {icon: "fa fa-user-o", name: "member", role: "MEMBER"},
    JOIN_REQUEST: {icon: "fa fa-envelope", name: "join_request", role: "JOIN_REQUEST"},
    INVITATION: {icon: "fa fa-clock-o", name: "invitation", role: "INVITATION"}
};

export function allowedToLeave(team, currentUser) {
    const admins = team.memberships.filter(membership => membership.role === "ADMIN");
    return admins.length > 1 || (admins.length === 1 && admins[0].urnPerson !== currentUser.urn);
}

export function currentUserRoleInTeam(team, currentUser) {
    return team.memberships.filter(membership => membership.urnPerson === currentUser.urn)[0].role;
}

export function iconForRole(role) {
    return ROLES[role].icon;
}

export function labelForRole(role) {
    return I18n.t(`icon_legend.${ROLES[role].name}`);
}
// export function allowedRoles(currentUser, otherMember) {
//     return currentUser ||;
// }


