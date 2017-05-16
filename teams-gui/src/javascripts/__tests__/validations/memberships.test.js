import {allowedToLeave, hasOneAdmin, currentUserRoleInTeam, labelForRole, ROLES} from "../../validations/memberships";
import start from "../base";
start();

const currentUser = {urn: "john"};

test("Label for role", () => {
    expect(labelForRole(ROLES.ADMIN.role)).toBe("Admin")
});

test("Has one admin", () => {

});

test("Can not leave when user is only admin", () => {
    const team = {memberships: [{role: "ADMIN", urnPerson: "john"}]};
    expect(allowedToLeave(team, currentUser)).toBe(false);
});

test("May leave as member", () => {
    const team = {memberships: [{role: "ADMIN", urnPerson: "admin"}, {role: "MEMBER", urnPerson: "john"}]};
    expect(allowedToLeave(team, currentUser)).toBe(true);
});

test("May leave as admin if there are other admin's", () => {
    const team = {memberships: [{role: "ADMIN", urnPerson: "admin"}, {role: "ADMIN", urnPerson: "john"}]};
    expect(allowedToLeave(team, currentUser)).toBe(true);
});

test("Current role in team", () => {
    const team = {memberships: [{role: "ADMIN", urnPerson: "admin"}, {role: "MEMBER", urnPerson: "john"}]};
    expect(currentUserRoleInTeam(team, currentUser)).toBe("MEMBER");
});
