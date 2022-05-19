import {isEmpty} from "./utils";
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

export function allowedToLeave(team, currentUser) {
    const isMember = team.memberships.find(membership => membership.urnPerson === currentUser.urn);
    const admins = team.memberships
        .filter(membership => (membership.role === ROLES.ADMIN || membership.role === ROLES.OWNER)
            && membership.urnPerson !== currentUser.urn);
    return (admins.length > 0 && !isEmpty(isMember)) || (!isEmpty(isMember) && isMember.role !== ROLES.ADMIN && isMember.role !== ROLES.OWNER);
}

export function hasOneAdmin(team, currentUser) {
    const pendingAdminInvitations = (team.invitations || []).filter(invitation => (invitation.intendedRole === ROLES.ADMIN ||
        invitation.intendedRole === ROLES.OWNER) && !invitation.declined);
    const hasPendingAdminInvitations = pendingAdminInvitations.length > 0;
    const admins = team.memberships
        .filter(membership => (membership.role === ROLES.ADMIN || membership.role === ROLES.OWNER)
            && membership.urnPerson !== currentUser.urn);
    const membership = team.memberships.find(membership => membership.urnPerson === currentUser.urn);
    const isAdmin = membership && membership.role === ROLES.ADMIN;
    return admins.length === 0 && !hasPendingAdminInvitations && isAdmin;
}

export function currentUserRoleInTeam(team, currentUser) {
    if (currentUser.superAdminModus) {
        return "SUPER_ADMIN";
    }
    return (team.memberships.find(membership => membership.urnPerson === currentUser.urn) || {role: ROLES.GUEST}).role;
}

export function isOnlyAdmin(team, currentUser) {
    const admins = team.memberships.filter(membership => membership.role === ROLES.ADMIN || membership.role === ROLES.OWNER);
    const userRoleInTeam = currentUserRoleInTeam(team, currentUser);
    return admins.length === 1 && (userRoleInTeam === ROLES.ADMIN || userRoleInTeam === ROLES.OWNER);
}

export const actionDropDownTitle = (team, user) => {
    const membership = getMembership(team, user);
    if (!membership) {
        return I18n.t("roles.title", {role: "guest"});
    }
    return I18n.t("roles.title", {role: membership.role.toLowerCase()});
}
