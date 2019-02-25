import React, {Component} from "react";

class PasswordInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            length:0,
            colors:[this.props.backgroundColor,'#ff0000','#f6c000','#009900'],
            complexLvl:0
        }
    }

    onChange = (event) => {
        const value=event.currentTarget.value;
        let complexLvl=0;
        const regexNumber = new RegExp('\\d+');
        //const regexLetter = new RegExp('\\w+');
        const regexUpperCase = new RegExp('[A-Z]+');
        const regexLowerCase = new RegExp('[a-z]+');


        if(regexNumber.test(value)){
            complexLvl++;
        }
        if(regexLowerCase.test(value)){
            complexLvl++;
        }
        if(regexUpperCase.test(value)){
            complexLvl++;
        }
        let length=Math.round(value.length*100/this.props.minLength);
        if(length>=100){
            length=100;
        }else{
            complexLvl=1; //si la longueur min n'est pas atteinte
        }
        this.setState({length:length,complexLvl:complexLvl} )


    };


    render(){
        return (
            <div>
                <input type="password"
                       tabIndex={this.props.tabIndex}
                       onClick={this.props.onClick}
                       className={this.props.className}
                       name={this.props.name}
                       id={this.props.id}
                       maxLength={this.props.maxLength}
                       required={this.props.required}
                       placeholder={this.props.placeholder}
                       onChange={this.onChange}
                       value={this.props.value}
                       defaultValue={this.props.defaultValue}
                />
               <div style={{backgroundColor:this.props.backgroundColor}}>
                   <div style={{width:this.state.length+'%',height:'5px',backgroundColor:this.state.colors[this.state.complexLvl]}} ></div>
               </div>
            </div>
        )
    }
}


export default PasswordInput;