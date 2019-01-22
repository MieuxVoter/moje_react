import React, {Component} from "react";
import config from 'react-global-configuration';

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


    render() {
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

