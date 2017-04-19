export function allowedToLeave(team, currentUser) {
    const admins = team.memberships.filter(membership => membership.role === "ADMIN");
    return admins.length > 1 || (admins.length === 1 && admins[0].urnPerson !== currentUser.urn);
}

export function roleOfMembership(member ) {
    return member.role ? member.role.substring(0, 1) + member.role.substring(1).toLowerCase() : "Member";
}

export function currentUserRoleInTeam(team, currentUser) {
    return team.memberships.filter(membership => membership.urnPerson === currentUser.urn)[0].role;
}


