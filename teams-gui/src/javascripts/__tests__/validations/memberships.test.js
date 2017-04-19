import MembershipsValidator from "../../validations/memberships";

const currentUser = {urn: "john"};

test("Can not leave when user is only admin", () => {
    const team = {memberships: [{role: "ADMIN", urnPerson: "john"}]};
    expect(MembershipsValidator.allowedToLeave(team, currentUser)).toBe(false);
});

test("May leave as member", () => {
    const team = {memberships: [{role: "ADMIN", urnPerson: "admin"},{role: "MEMBER", urnPerson: "john"}]};
    expect(MembershipsValidator.allowedToLeave(team, currentUser)).toBe(true);
});

test("May leave as admin if there are other admin's", () => {
    const team = {memberships: [{role: "ADMIN", urnPerson: "admin"},{role: "ADMIN", urnPerson: "john"}]};
    expect(MembershipsValidator.allowedToLeave(team, currentUser)).toBe(true);
});