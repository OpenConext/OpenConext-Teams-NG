import MembershipsValidator from "../../validations/memberships";

test("Can not leave without admin", () => {
    expect(MembershipsValidator.allowedToLeave({memberships: []})).toBe(false);
});