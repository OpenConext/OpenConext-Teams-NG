import React from "react";

import {emitter, getFlash} from "../utils/flash";

export default class Flash extends React.Component {
    constructor() {
        super();
        this.state = {flash: null, className: ""};
        this.callback = flash => {
            this.setState({flash: flash, className: ""});
            if (flash && (!flash.type || flash.type !== "error") && false) {
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

    closeFlash = () => {
        this.setState({flash: null, className: ""});
    };

    iconForMessage = type => {
        switch (type) {
            case "info" : return "<i class=\"fa fa-check\"></i>";
            case "warning" : return "<i class=\"fa fa-exclamation\"></i>";
            case "error" : return "<i class=\"fa fa-times\"></i>";
            default: return null;
        }
    } ;

    render() {
        const {flash, className} = this.state;

        if (flash && flash.message) {
            const message = `${flash.message}${this.iconForMessage(flash.type)}`;
            return (
                <div className={`flash ${className}`}>
                    <p className={flash.type} dangerouslySetInnerHTML={{__html: message}}>
                    </p>

                    <a className="close" href="#" onClick={this.closeFlash}>
                        <i className="fa fa-remove"></i>
                    </a>
                </div>
            );
        }

        return null;
    }
}
