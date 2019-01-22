import React, {Component} from "react";
import {Link} from "react-router-dom";

class Menu extends Component {
    constructor() {
        super();
        this.state = {
            candidates: [],
            candidateInputFieldId: 0,
            candidateInputFields: [],
            rates: [],
            rateInputFieldId: 0,
            rateInputFields: [],
            voterInput: []
        }
    }

    user_disconnect() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        window.location.assign('/log-in');
    }

    render() {
        return (
            <div className="top_nav">
                <div className="nav_menu">
                    <nav>
                        <ul className="nav navbar-nav navbar-left">
                            <li>
                                <Link to={`/dashboard`}>
                                    <img src="/brand.svg" alt="logo" height="32"/>
                                </Link>
                            </li>
                        </ul>
                        {localStorage.getItem('username') ? (
                            <ul className="nav navbar-nav navbar-right">
                                <li role="presentation" className="dropdown">
                                    <a href="/help" className="dropdown-toggle info-number"
                                       data-toggle="dropdown"
                                       aria-expanded="false">
                                        <i className="fa fa-question"></i>
                                    </a>
                                </li>
                                <li role="presentation" className="dropdown">
                                    <a href="#" onClick={this.user_disconnect} className="dropdown-toggle info-number"
                                       data-toggle="dropdown"
                                       aria-expanded="false">
                                        <i className="fa fa-sign-out"></i>
                                    </a>
                                </li>
                                <li>
                                    <Link to={`/dashboard`}>
                                        <i className="fa fa-user"></i> {String(localStorage.getItem('username'))}
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/`}><i className="fa fa-plus"></i> Nouveau scrutin</Link>
                                </li>
                            </ul>
                        ) : (
                            <ul className="nav navbar-nav navbar-right">
                                <li role="presentation" className="dropdown">
                                    <a href="/help" className="dropdown-toggle info-number"
                                       data-toggle="dropdown"
                                       aria-expanded="false">
                                        <i className="fa help-block"></i>
                                    </a>
                                </li>
                                <li role="presentation" className="dropdown">
                                    <Link to={`/log-in`}>Connexion</Link>
                                </li>
                            </ul>
                        )}
                    </nav>
                </div>
            </div>
        );
    }
}

export default Menu;
