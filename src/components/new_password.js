import React, {Component} from "react";
import config from 'react-global-configuration';

class new_password extends Component {


    constructor() {
        super();
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
        this.state = {
            token: null,
        }
        this.initInterface();
    }

    handleSubmitLogin(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        data.append('password_token', this.state.token);
        data.append('email', document.getElementById('email').value);

        fetch(config.get('server_url') + 'ws/data/new-password/', {
            method: 'POST',
            body: data,
        })
            .then(result => {
                if (result.status === 200) {
                    localStorage.setItem('email', document.getElementById('email').value);
                    localStorage.setItem('password', document.getElementById('password').value);
                    window.location.assign('/dashboard');
                } else {
                    //TODO identification échoué
                }
            });
    }

    initInterface() {
        let url = window.location.href;
        let url_items = url.split('/');
        this.state.token = url_items[url_items.length - 1];
        console.log(this.state.token);
    }


    render() {
        return (
            <div className="container body">
                <div className="login-background">
                    <a href="#top" className="hiddenanchor" id="signup">signup</a>
                    <a href="#top" className="hiddenanchor" id="signin">signin</a>

                    <div className="login_wrapper">
                        <div id="register">
                            <section className="login_content register_content" id="reset_password">
                                <form onSubmit={this.handleSubmitLogin} autoComplete="off">
                                    <h1>Changer le mot de passe</h1>
                                    <div>
                                        <input email="email" id="email" type="email" className="form-control" placeholder="Adresse email" required=""/>
                                    </div>
                                    <div>
                                        <input name="password" id="password" type="password" className="form-control" placeholder="Mot de passe"
                                               required=""/>
                                    </div>
                                    <div>
                                        <button className="btn btn-default submit">Valider</button>
                                    </div>
                                    <div className="clearfix"></div>

                                    <div className="separator">
                                        <p className="change_link">
                                            <a href="/log-in" className="to_register">Déjà enregistré ? Connectez-vous</a>
                                        </p>
                                        <div>
                                            <img src="/brand.svg" alt="logo" width="80" height="80"/>
                                        </div>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default new_password;

