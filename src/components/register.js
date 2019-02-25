import React, {Component} from "react";
import config from 'react-global-configuration';
import PasswordInput from "./formComponents/PasswordInput";

class register extends Component {


    constructor() {
        super();
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
        this.state = {
            token: null
        }
    }

    handleSubmitLogin(event) {
        console.log('ok');
        event.preventDefault();
        const data = new FormData(event.target);
        // https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f
        fetch(config.get('server_url') + 'ws/data/sign-in/', {
            method: 'POST',
            body: data,
        })
            .then(result => {
                if (result.status === 200) {
                    localStorage.setItem('username', String(data.get('username')));
                    localStorage.setItem('password', String(data.get('password')));
                    window.location.assign('/');
                } else {
                    //TODO identification échoué
                }
            });
    }

    render(){
        return(
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1 className="text-primary">Créer un compte</h1>
                        <hr/>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12">
                        <label htmlFor="username"><b>Votre nom</b> <span
                            className="text-muted">(obligatoire)</span></label>
                        <input type="text" name="name" id="username"
                               required="required" className="form-control" maxLength="250" autoFocus tabIndex="1"
                               placeholder="Votre nom, prénom ou pseudonyme ..."/>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12">
                        <label htmlFor="email"><b>Votre adresse e-mail</b> <span
                            className="text-muted">(obligatoire)</span></label>
                        <input type="text" name="name" id="email"
                               required="required" className="form-control" maxLength="250"  tabIndex="2"
                               placeholder="Votre adresse e-mail"/>
                               <span className="text-muted">Attention ! Un lien permettant de finaliser la création de votre compte sera envoyé à cette adresse.</span>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12">
                        <label htmlFor="password"><b>Votre mot de passe</b> <span
                            className="text-muted">(obligatoire)</span></label>
                        <PasswordInput name="password" id="password"
                                       backgroundColor="#bbb"
                               required="required" className="form-control" minLength="8" maxLength="50"  tabIndex="3"
                               placeholder="Votre mot de passe"/>
                        <span className="text-muted">Saisir 8 caractères minimum avec au moins une lettre et un chiffre</span>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12">
                        <label htmlFor="password"><b>Confirmation du mot de passe</b> <span
                            className="text-muted">(obligatoire)</span></label>
                        <input type="password" name="confirm_password" id="confirm_password"
                               required="required" className="form-control" maxLength="50"  tabIndex="3"
                               placeholder="Votre mot de passe"/>
                        <span className="text-muted">Re-saisir votre mot de passe à l'identique.</span>
                    </div>
                </div>

                <div className="row mt-5">

                    <div className="col-12 text-right">
                        <hr/>

                        <button type="button" tabIndex="7" className="btn btn-success btn-lg"
                               ><i
                            className="fas fa-check mr-2"/>Créer <span
                            className="d-none d-md-inline">mon compte</span>
                        </button>

                    </div>
                </div>


            </div>
        )
    }

    renderOld() {
        return (
            <div className="container body">
                <div className="login-background">
                    <a href="#top" className="hiddenanchor" id="signup">signup</a>
                    <a href="#top" className="hiddenanchor" id="signin">signin</a>

                    <div className="login_wrapper">
                        <div id="register">
                            <section className="login_content register_content">
                                <form onSubmit={this.handleSubmitLogin}>
                                    <h1>Créez un compte</h1>
                                    <div>
                                        <input name="username" type="text" className="form-control" placeholder="Nom de l'utilisateur" required=""/>
                                    </div>
                                    <div>
                                        <input email="email" type="email" className="form-control" placeholder="Adresse email" required=""/>
                                    </div>
                                    <div>
                                        <input name="password" type="password" className="form-control" placeholder="Mot de passe"
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

export default register;

