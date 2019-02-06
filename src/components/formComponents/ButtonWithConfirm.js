import React, {Component} from "react";
import ModalConfirm from "./ModalConfirm";



class ButtonWithConfirm extends Component {
    constructor(props) {
        super(props);
        this._modalConfirm=React.createRef();
        this.state={
            focused:false
        }
    }

    getComponent= (key) => {
        return this.props.children.filter( (comp) => {
            return comp.key === key;
        });
    };

    render() {

        return (
            <button
                className={this.props.className}
                onClick={() => { this._modalConfirm.current.toggle() }}
                >{this.getComponent("button")}
                <ModalConfirm className={this.props.modalClassName}  ref={this._modalConfirm}>
                    <div key="title">{this.getComponent("modal-title")}</div>
                    <div key="body">{this.getComponent("modal-body")}</div>
                    <div key="confirm">{this.getComponent("modal-confirm")}</div>
                    <div key="cancel">{this.getComponent("modal-cancel")}</div>
                </ModalConfirm>
            </button>
        );
    }
}

export default ButtonWithConfirm;