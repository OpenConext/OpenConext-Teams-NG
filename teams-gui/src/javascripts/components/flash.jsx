import React from "react";

import {clearFlash, clearFlashDependencies, emitter, getFlash} from "../utils/flash";

export default class Flash extends React.Component {

    constructor() {
        super();
        this.state = {flash: null, className: ""};
        this.callback = flash => {
            this.setState({flash: flash, className: ""});
            if (flash && (!flash.type || flash.type !== "error")) {
                setTimeout(() => {
                    this.setState({className: "hide"});
                    clearFlashDependencies();
                }, flash.type === "info" ? 3500 : 5500);
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

    render() {
        const {flash, className} = this.state;

        if (flash && flash.message) {
            return (
                <div className={`flash ${className} ${flash.type}`}>
                    <div className="message-container">
                        <p dangerouslySetInnerHTML={{__html: flash.message}}>
                        </p>
                        <a className="close" href="#" onClick={clearFlash}>
                            <i className="fa fa-remove"></i>
                        </a>
                    </div>
                </div>
            );
        }

        return null;
    }
}
