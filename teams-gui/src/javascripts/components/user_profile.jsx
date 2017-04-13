import React from "react";
import I18n from "i18n-js";

class UserProfile extends React.Component {

    render() {
        const {currentUser} = this.context;
        return (
            <ul className="user-profile">
                <li>
                    {currentUser.person.email}
                </li>
                <li>
                    {I18n.t("profile." + currentUser.person.guest)}
                </li>
            </ul>
        );
    }

}

UserProfile.contextTypes = {
    currentUser: React.PropTypes.object
};

export default UserProfile;
