import React, {Component} from "react";
import config from 'react-global-configuration';

class election_detail extends Component {
    constructor() {
        super();
        this.state = {
            uuid: null,
            rates: [],
            candidates: [],
            candidatesFields: [],
            ratesFields: [],
            uniqueKey: 1
        }
        this.set_ballot_params();
    }


    set_ballot_params() {
        let url = window.location.href;
        let url_items = url.split('/');
        this.state.uuid = url_items[url_items.length - 1];
        this.get_election_informations();
        if (localStorage.getItem('number_ballot') == null) {
            window.location.reload();
        }
    }

    get_election_informations() {
        let data = new FormData();
        data.append('id_election', this.state.uuid);
        fetch(config.get('server_url') + 'ws/election/detail/', {
            method: 'POST',
            body: data
        })
            .then((resp) => resp.json()) // Transform the data into json
            .then(function (result) {
                localStorage.setItem('id_election', result.id_election);
                localStorage.setItem('ballot_name', result.ballot_name);
                localStorage.setItem('ballot_note', result.ballot_note);
                localStorage.setItem('rates', result.grades);
                localStorage.setItem('candidates', result.candidates);
                localStorage.setItem('number_voter', result.number_voter);
                localStorage.setItem('number_ballot', result.number_ballot);
            })
            .catch(function () {
                // This is where you run code if the server returns any errors
            });
    }

    closeElection() {
        let data = new FormData();
        data.append('id_election', localStorage.getItem('id_election'));
        data.append('username', localStorage.getItem('username'));
        data.append('password', localStorage.getItem('password'));
        fetch(config.get('server_url') + 'ws/election/close/', {
            method: 'POST',
            body: data
        })
            .then(result => {

                if (result.status === 200) {
                    window.location.assign('/election_result');
                } else {
                    document.getElementById('status_ws').innerHTML = 'Veuillez vous identifier pour cloturer l\'élection';
                }
            })
    }

    deleteElection() {
        let data = new FormData();
        data.append('id_election', localStorage.getItem('id_election'));
        data.append('username', localStorage.getItem('username'));
        data.append('password', localStorage.getItem('password'));
        fetch(config.get('server_url') + 'ws/election/delete/', {
            method: 'POST',
            body: data
        })
            .then(result => {
                if (result.status === 200) {
                    window.location.assign('/dashboard');
                } else {
                    //TODO identification échoué
                }
            })
    }

    render() {
        return (
            <div className="container body">
                <div className="row">
                    {/* INFORMATIONS GÉNÉRALES */}
                    <div id="general_information"
                         className="box_placeholder col-lg-offset-1 col-lg-10 col-sm-12">
                        <div className="x_panel tile">
                            <div className="x_title">
                                <h2>Information générales</h2>
                                <div className="clearfix"></div>
                                <p className="change_link" id="status_ws"></p>
                            </div>
                            <div className="clearfix"></div>
                            {/* Ballot name */}
                            <div className="row">
                                <div className="col-lg-12">
                                    <label>Titre du scrutin</label>
                                    <div>{localStorage.getItem('ballot_name')}</div>
                                </div>
                            </div>

                            {/* Ballot description */}
                            <div className="row">
                                <div className="col-lg-12">
                                    <label>Description du scrutin</label>
                                    <div>{localStorage.getItem('ballot_note')}</div>
                                </div>
                            </div>

                            {/* Election number of voter */}
                            <div className="row">
                                <div className="col-lg-12">
                                    <label>Nombre d'élécteurs</label>
                                    <div>{localStorage.getItem('number_ballot')} / {localStorage.getItem('number_voter')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 text-center">
                        <button type="button" className="btn btn-primary btn-lg"
                                onClick={evt => this.closeElection(evt)}><i className="fa fa-trash"></i> CLOTURER
                            L'ÉLECTION
                        </button>
                    </div>
                    <div className="col-md-6 text-center">
                        <button type="button" className="btn btn-primary btn-lg"
                                onClick={evt => this.deleteElection(evt)}>SUPPRIMER L'ÉLECTION
                        </button>
                    </div>
                </div>

            </div>
        );
    }
}

export default election_detail;

