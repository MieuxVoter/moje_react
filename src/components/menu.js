import React, {Component} from "react";
import {Link, NavLink} from "react-router-dom";
import {Collapse, Container, Nav, Navbar, NavbarToggler, NavItem} from 'reactstrap';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            candidates: [],
            candidateInputFieldId: 0,
            candidateInputFields: [],
            rates: [],
            rateInputFieldId: 0,
            rateInputFields: [],
            voterInput: [],
            isOpen: false

        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    user_disconnect() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        window.location.assign('/log-in');
    }

    render() {
        return (
            <div >
                <Navbar color="light" light expand="md">
                    <Container>
                        <Link to={`/`} className="navbar-brand">
                            <img src="/brand.svg" alt="logo" height="32"/>
                        </Link>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <hr />
                            {localStorage.getItem('username') ? (
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <NavLink to={`/dashboard`} className="btn btn-link text-primary" ><i className="fas fa-list-alt mr-2" />Tableau de bord</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink to={`/`} className="btn btn-link text-primary" ><i className="fas fa-gavel mr-2" />Nouveau scrutin</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <a  onClick={this.user_disconnect} className="btn btn-link text-primary" ><i className="fas fa-unlock mr-2" />Déconnexion</a>
                                    </NavItem>
                                </Nav>
                            ) : (
                                <Nav className="ml-auto" navbar>
                                    <NavItem>
                                        <NavLink to={`/log-in`} className="btn btn-link text-primary"><i className="fas fa-user-circle mr-2" />Créer un compte</NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink to={`/log-in`} className="btn btn-link text-primary"><i className="fas fa-lock mr-2" />Connexion</NavLink>
                                    </NavItem>
                                </Nav>
                            )}


                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        );
    }
    renderBackup() {
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
