import React from "react";

import {emitter, getFlash} from "../utils/flash";

export default class Flash extends React.Component {

    constructor() {
        super();
        this.state = {flash: null, className: ""};
        this.callback = flash => {
            this.setState({flash: flash, className: ""});
            if (flash && (!flash.type || flash.type !== "error")) {
                setTimeout(() => this.setState({className: "hide"}),
                    flash.type === "info" ? 3500 : 5500);
            }
        };
    }

    componentWillMount() {
        this.setState({flash: getFlash()});
        emitter.addListener("flash", this.callback);
    }

    componentWillUnmount() {
        emitter.removeListener("flash", this.callback);
    }

    iconForMessage = type => {
        return type === "info" ?
            "<i class=\"fa fa-check\"></i>" :
            type === "warning" ? "<i class=\"fa fa-exclamation\"></i>" : "<i class=\"fa fa-times\"></i>";
    };

    render() {
        const {flash, className} = this.state;

        if (flash && flash.message) {
            return (
                <div className={`flash ${className} ${flash.type}`}>
                    <p dangerouslySetInnerHTML={{__html: flash.message}}>
                    </p>

                    <a className="close" href="#" onClick={() => this.setState({flash: null, className: ""})}>
                        <i className="fa fa-remove"></i>
                    </a>
                </div>
            );
        }

        return null;
    }
}
