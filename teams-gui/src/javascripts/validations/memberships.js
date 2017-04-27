export function allowedToLeave(team, currentUser) {
    const admins = team.memberships.filter(membership => membership.role === "ADMIN");
    return admins.length > 1 || (admins.length === 1 && admins[0].urnPerson !== currentUser.urn);
}

export function roleOfMembership(member) {
    //either membership, invitation or joinRequest
    const role = member.role || member.intendedRole || "Member";
    return role.substring(0, 1) + role.substring(1).toLowerCase();
}

export function currentUserRoleInTeam(team, currentUser) {
    return team.memberships.filter(membership => membership.urnPerson === currentUser.urn)[0].role;
}

// export function allowedRoles(currentUser, otherMember) {
//     return currentUser ||;
// }


