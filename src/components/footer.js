import React, {Component} from "react";
import {Link} from "react-router-dom";

class Footer extends Component {
    render() {
        return (
            <div id="footer">
                <ul>
                    <li>
                        <Link to={`/`}>
                            <img src="/brand.svg" alt="logo" height="32"/>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/`}>Accueil</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Footer;
