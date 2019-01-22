import React, {Component} from "react";
import config from 'react-global-configuration';

class login extends Component {


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
        // https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f
        fetch(config.get('server_url') + 'ws/data/log-in/', {
            method: 'POST',
            body: data,
        })
            .then(result => {
                if (result.status === 200) {
                    localStorage.setItem('username', String(data.get('username')));
                    localStorage.setItem('password', String(data.get('password')));
                    window.location.assign('/dashboard');
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
                        <div className="animate form login_form">
                            <section className="login_content">
                                <form onSubmit={this.handleSubmitLogin}>
                                    <h1>Connectez-vous</h1>
                                    <div>
                                        <input name="username" type="text" className="form-control"
                                               placeholder="Nom d'utilisateur"
                                               required=""/>
                                    </div>
                                    <div>
                                        <input name="password" type="password" className="form-control"
                                               placeholder="Mot de passe" required=""/>
                                    </div>
                                    <div>
                                        <button className="btn btn-default submit" >Valider</button>
                                        <a className="reset_pass" href="/reset_password">Mot de passe perdu ?</a>
                                    </div>

                                    <div className="clearfix"></div>

                                    <div className="separator">
                                        <p className="change_link">
                                            <a href="/sign-up" className="to_register">Nouveau sur le site ? Créer un compte</a>
                                        </p>

                                        <div className="clearfix"></div>
                                        <br/>

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

export default login;

