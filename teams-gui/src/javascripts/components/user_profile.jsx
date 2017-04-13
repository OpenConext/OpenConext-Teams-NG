import React from "react";
import I18n from "i18n-js";

class UserProfile extends React.Component {

  render() {
    return (
      <ul className="user-profile">
        {this.renderRole()}
      </ul>
    );
  }

  renderRole() {
    const { currentUser } = this.context;

    return (
      <li>
        <h2>{I18n.t("header.role")}</h2>
        <ul>
          <li className="user-profile-entity">
            {I18n.t("profile." + currentUser.authorities[0].authority)}
          </li>
        </ul>
      </li>
    );
  }

}

UserProfile.contextTypes = {
  currentUser: React.PropTypes.object
};

export default UserProfile;
