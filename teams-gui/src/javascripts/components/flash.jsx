import React from "react";

import {emitter, getFlash, clearFlash} from "../utils/flash";
import {isEmpty} from "../utils/utils";

export default class Flash extends React.PureComponent {

    constructor() {
        super();
        this.state = {flash: {}, className: "hide", type: "info"};
        this.callback = flash => {
            this.setState({flash: flash, className: isEmpty(flash) || isEmpty(flash.message) ? "hide" : ""});
            if (flash && (!flash.type || flash.type !== "error")) {
                setTimeout(() => this.setState({className: "hide"}), flash.type === "info" ? 3500 : 5500);
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

        return (
            <div className={`flash ${className} ${flash.type}`}>
                <div className="message-container">
                    <p dangerouslySetInnerHTML={{__html: flash.message}}>
                    </p>
                    <a className="close" onClick={clearFlash}>
                        <i className="fa fa-remove"></i>
                    </a>
                </div>
            </div>
        );
    }
}
