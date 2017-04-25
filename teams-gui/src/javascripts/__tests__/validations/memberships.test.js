import {allowedToLeave, roleOfMembership, currentUserRoleInTeam} from "../../validations/memberships";

const currentUser = {urn: "john"};

test("Can not leave when user is only admin", () => {
    const team = {memberships: [{role: "ADMIN", urnPerson: "john"}]};
    expect(allowedToLeave(team, currentUser)).toBe(false);
});

test("May leave as member", () => {
    const team = {memberships: [{role: "ADMIN", urnPerson: "admin"},{role: "MEMBER", urnPerson: "john"}]};
    expect(allowedToLeave(team, currentUser)).toBe(true);
});

test("May leave as admin if there are other admin's", () => {
    const team = {memberships: [{role: "ADMIN", urnPerson: "admin"},{role: "ADMIN", urnPerson: "john"}]};
    expect(allowedToLeave(team, currentUser)).toBe(true);
});

test("Role of membership capitalized", () => {
    expect(roleOfMembership({role: "ADMIN"})).toBe("Admin");
});

test("Role of membership with sensible default", () => {
    expect(roleOfMembership({})).toBe("Member");
});

test("Current role in team", () => {
    const team = {memberships: [{role: "ADMIN", urnPerson: "admin"},{role: "MEMBER", urnPerson: "john"}]};
    expect(currentUserRoleInTeam(team, currentUser)).toBe("MEMBER");
});