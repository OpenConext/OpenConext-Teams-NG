import {allowedToLeave, hasOneAdmin, isOnlyAdmin,currentUserRoleInTeam, iconForRole,labelForRole, ROLES} from "../../validations/memberships";
import start from "../base";
import I18n from "i18n-js";
start();

const currentUser = {urn: "john" };

test("Label for role", () => {
    expect(labelForRole(ROLES.ADMIN.role)).toBe(I18n.translations.en.icon_legend.admin)
});

test("Has one admin with pending admin invitation", () => {
    const team = {invitations: [{intendedRole: ROLES.ADMIN.role}], memberships: [{role: ROLES.ADMIN.role, urnPerson: currentUser.urn}]};
    expect(hasOneAdmin(team, currentUser)).toBe(false);
});

test("Has one admin with declined admin invitation", () => {
    const team = {invitations: [{intendedRole: ROLES.ADMIN.role, declined: true}], memberships: [{role: ROLES.ADMIN.role, urnPerson: currentUser.urn}]};
    expect(hasOneAdmin(team, currentUser)).toBe(true);
});

test("Has one admin with no admin invitation", () => {
    const team = {memberships: [{role: ROLES.ADMIN.role, urnPerson: currentUser.urn}]};
    expect(hasOneAdmin(team, currentUser)).toBe(true);
});

test("Has one admin who is not the current user", () => {
    const team = {memberships: [{role: ROLES.ADMIN.role, urnPerson: "different"}]};
    expect(hasOneAdmin(team, currentUser)).toBe(false);
});

test("Can not leave when user is only admin", () => {
    const team = {memberships: [{role: ROLES.ADMIN.role, urnPerson: currentUser.urn}]};
    expect(allowedToLeave(team, currentUser)).toBe(false);
});

test("May leave as member", () => {
    const team = {memberships: [{role: ROLES.ADMIN.role, urnPerson: "admin"}, {role: ROLES.MEMBER.role, urnPerson: currentUser.urn}]};
    expect(allowedToLeave(team, currentUser)).toBe(true);
});

test("May leave as admin if there are other admin's", () => {
    const team = {memberships: [{role: ROLES.ADMIN.role, urnPerson: "admin"}, {role: ROLES.ADMIN.role, urnPerson: currentUser.urn}]};
    expect(allowedToLeave(team, currentUser)).toBe(true);
});

test("Current role in team", () => {
    const team = {memberships: [{role: ROLES.ADMIN.role, urnPerson: "admin"}, {role: ROLES.MEMBER.role, urnPerson: currentUser.urn}]};
    expect(currentUserRoleInTeam(team, currentUser)).toBe(ROLES.MEMBER.role);
});

test("Only admin in team", () => {
    const team = {memberships: [{role: ROLES.ADMIN.role, urnPerson: currentUser.urn}]};
    expect(isOnlyAdmin(team, currentUser)).toBe(true);
});

test("Multiple admins in team", () => {
    const team = {memberships: [{role: ROLES.ADMIN.role, urnPerson: "admin"}, {role: ROLES.ADMIN.role, urnPerson: currentUser.urn}]};
    expect(isOnlyAdmin(team, currentUser)).toBe(false);
});

test("Icon for role", () => {
    expect(iconForRole(ROLES.ADMIN.role)).toBe("fa fa-star");
});

