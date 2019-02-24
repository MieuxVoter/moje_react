import React, {Component} from "react";
import config from 'react-global-configuration';

class reset_password extends Component {


    constructor() {
        super();
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
        this.state = {
            token: null
        }
    }

    handleSubmitLogin(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        data.append('email', document.getElementById('email').value);
        fetch(config.get('server_url') + 'ws/data/reset-password/', {
            method: 'POST',
            body: data,
        })
            .then(result => {
                if (result.status === 200) {
                    document.getElementById('status_ws').innerHTML = 'Mail envoyé avec succès';
                } else {
                    document.getElementById('status_ws').innerHTML = 'Ce compte n\'existe pas';
                }
            });
    }

    render(){
        return (
            <div className="text-center">
                <form className="form-short text-center">
                    <img src="brand.svg" alt="logo" width="80" height="80"/>
                    <h1 className="h3 mb-3 font-weight-normal">Mot de passe oublié ?</h1>
                    <p class="small">Veuillez saisir l'adresse e-mail correspondant à votre compte. Nous vous enverrons un e-mail vous permettant de saisir un nouveau mot de passe.</p>
                    <label htmlFor="inputEmail" className="sr-only">Addresse e-mail</label>
                    <input type="email" id="inputEmail" className="form-control" placeholder="Addresse e-mail" required
                           autoFocus />
                    {/*<div className="checkbox mb-3">
                            <label>
                                <input type="checkbox" value="remember-me" /> Se souvenir de moi
                            </label>
                        </div>*/}
                    <button className="mt-3 btn btn-lg btn-primary btn-block" type="submit">Envoyer</button>
                </form></div>)
    }

    renderOld() {
        return (
            <div className="container body">
                <div className="login-background">
                    <a href="#top" className="hiddenanchor" id="signup">signup</a>
                    <a href="#top" className="hiddenanchor" id="signin">signin</a>

                    <div className="login_wrapper">
                        <div id="register">
                            <section className="login_content register_content" id="reset_password">
                                <form onSubmit={this.handleSubmitLogin}>
                                    <h1>Réinitialiser le mot de passe</h1>
                                    <div>
                                        <input email="email" type="email" id="email" className="form-control" placeholder="Adresse email" required=""/>
                                    </div>
                                    <div>
                                        <p className="change_link" id="status_ws"></p>
                                        <button className="btn btn-default submit">Valider</button>
                                    </div>
                                    <div className="clearfix"></div>

                                    <div className="separator">
                                        <p className="change_link">
                                            <a href="/log-in" className="to_register">Déjà enregistré ? Connectez-vous</a>
                                        </p>
                                        <div>
                                            <img src="brand.svg" alt="logo" width="80" height="80"/>
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

export default reset_password;

