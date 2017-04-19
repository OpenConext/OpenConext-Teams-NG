const MembershipsValidator = {

    allowedToLeave: function (team, currentUser) {
        const admins = team.memberships.filter(membership => membership.role === "ADMIN");
        return admins.length > 1 || (admins.length === 1 && admins[0].urnPerson !== currentUser.urn);
    }

};

export default MembershipsValidator;
