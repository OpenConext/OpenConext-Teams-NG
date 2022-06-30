import "./NewTeam.scss";
import React from "react";
import "./JoinRequest.scss";
import MissingAttributesDialog from "../components/MissingAttributesDialog";

export const MissingAttributes = ({missingAttributes}) => {

    return (
        <MissingAttributesDialog isOpen={true} missingAttributes={missingAttributes}/>
    );

}
