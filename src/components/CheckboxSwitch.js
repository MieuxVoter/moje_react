import React, {Component} from "react";


class CheckboxSwitch extends Component {
    constructor(props) {
        super(props);
    }

    toggleHasDateEnd

    render() {
        return (
            <label className="switch">
                <input type="checkbox" id={this.props.id} name={this.props.name} onClick={this.props.onClick} className={this.props.className}/>
                <span className="slider round" />
            </label>
        );
    }
}

export default CheckboxSwitch;