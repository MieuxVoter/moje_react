import React, {Component} from "react";

class CheckboxSwitch extends Component {
    constructor(props) {
        super(props);
        this.state={
            focused:false
        }



    }


    render() {

        return (
            <label className={this.state.focused?"focused switch":"switch"} >
                <input
                    type="checkbox"
                    id={this.props.id}
                    onFocus={() => this.setState({ focused: true })}
                    onBlur={() => this.setState({ focused: false })}
                    name={this.props.name}
                    tabIndex={this.props.tabIndex}
                    onClick={this.props.onClick}
                    className={this.props.className}
                />
                <span className="slider round" />
            </label>
        );
    }
}

export default CheckboxSwitch;