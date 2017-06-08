import I18n from "i18n-js";

export const ROLES = {
    ADMIN: {icon: "fa fa-star", name: "admin", role: "ADMIN"},
    MANAGER: {icon: "fa fa-black-tie", name: "manager", role: "MANAGER"},
    MEMBER: {icon: "fa fa-user", name: "member", role: "MEMBER"},
    JOIN_REQUEST: {icon: "fa fa-envelope", name: "join_request", role: "JOIN_REQUEST"},
    INVITATION: {icon: "fa fa-clock-o", name: "invitation", role: "INVITATION"}
};

export function labelForRole(role) {
    return I18n.t(`icon_legend.${ROLES[role].name}`);
}

export function allowedToLeave(team, currentUser) {
    const admins = team.memberships
        .filter(membership => membership.role === ROLES.ADMIN.role && membership.urnPerson !== currentUser.urn);
    return admins.length > 0;
}

export function hasOneAdmin(team, currentUser) {
    const pendingAdminInvitations = (team.invitations || []).filter(invitation => invitation.intendedRole === ROLES.ADMIN.role
    && !invitation.declined);
    const hasPendingAdminInvitations = pendingAdminInvitations.length > 0;
    const admins = team.memberships
        .filter(membership => membership.role === ROLES.ADMIN.role && membership.urnPerson !== currentUser.urn);
    return admins.length === 0 && !hasPendingAdminInvitations;
}

export function currentUserRoleInTeam(team, currentUser) {
    return team.memberships.filter(membership => membership.urnPerson === currentUser.urn)[0].role;
}

export function isOnlyAdmin(team, currentUser) {
    const admins = team.memberships.filter(membership => membership.role === ROLES.ADMIN.role);
    return admins.length === 1 && currentUserRoleInTeam(team, currentUser) === ROLES.ADMIN.role;
}

export function iconForRole(role) {
    return ROLES[role].icon;
}
