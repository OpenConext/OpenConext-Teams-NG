import React from "react";
import {shallow} from "enzyme";
import I18n from "i18n-js";
import {} from "../../locale/en";
import UserProfile from "../../components/user_profile";

I18n.locale = "en";

test("UserProfile with email", () => {
    const currentUser = {person: {email: "test@org.net", guest: true}};
    const userProfile = shallow(
        <UserProfile currentUser={currentUser} />
    );

    expect(userProfile.contains(<span>Email:</span>)).toBe(true);

});