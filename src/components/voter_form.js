import React, {Component} from "react";
import config from 'react-global-configuration';

class voter_form extends Component {
    constructor() {
        super();
        this.state = {
            uuid: null,
            voter_key: null,
            voter_id: null,
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
        this.state.voter_id = url_items[url_items.length - 1];
        this.state.uuid = url_items[url_items.length - 3];
        this.state.voter_key = url_items[url_items.length - 2];
        this.get_election_informations();
        this.initRatesChoice();
        this.initCandidateChoice();
    }

    get_election_informations() {
        let data = new FormData();
        data.append('id_election', this.state.uuid);
        data.append('voter_key', this.state.voter_key);
        fetch(config.get('server_url') + 'ws/election/information/', {
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
            })
            .catch(function () {
                // This is where you run code if the server returns any errors
            });
    }

    sendVote(event) {
        event.preventDefault();
        const data = new FormData(event.target);

        let vote_arr = [];
        console.log(this.state.candidates);
        for (let i = 0; i < this.state.candidates.length; i++) {
            let candidate_id = this.state.candidates[i].id;
            switch (document.getElementById("li_rate_select_" + candidate_id + "").value) {
                case "1":
                    vote_arr.push([1,0,0,0,0]);
                    break;
                case "2":
                    vote_arr.push([0,1,0,0,0]);
                    break;
                case "3":
                    vote_arr.push([0,0,1,0,0]);
                    break;
                case "4":
                    vote_arr.push([0,0,0,1,0]);
                    break;
                case "5":
                    vote_arr.push([0,0,0,0,1]);
                    break;
                default:
                    alert("Veuillez sélection un vote pour chaque choix,");
                    return;
            }
        }

        data.set('username', localStorage.getItem('username'));
        data.set('password', localStorage.getItem('password'));
        data.set('vote', String(JSON.stringify(vote_arr)));
        data.set('id_election', localStorage.getItem('id_election'));
        data.set('private_key', String(this.state.voter_key));
        data.set('voter_id', String(this.state.voter_id));

        fetch(config.get('server_url') + 'ws/vote/create/', {
            method: 'POST',
            body: data,
        })
            .then(result => {
                if (result.status === 201) {
                    document.getElementById('status_ws').innerHTML = 'Votre vote à bien été pris en compte';
                } else {
                    document.getElementById('status_ws').innerHTML = 'Veuillez sélectionner les mentions pour chacune des propositions';
                }
            });
    }

    initCandidateChoice() {
        let candidates = JSON.parse(localStorage.getItem('candidates'));
        this.state.candidates = candidates;
        for (let i = 0; i < candidates.length; i++) {
            let candidate_id = candidates[i].id;
            let candidate_value = candidates[i].label;
            this.state.candidatesFields.push(
                <li id={["li_rate_" + candidate_id].join()} key={["li_rate_" + candidate_id].join()}>
                    <div className="x_panel tile overflow_hidden">
                        <div className="row">
                            <div className="col-lg-offset-1 col-lg-5 col-xs-12">
                                <h2>{candidate_value}</h2>
                            </div>
                            <div className="col-lg-offset-1 col-lg-5 col-xs-12 left-block">
                                <select id={["li_rate_select_" + candidate_id].join()} className="dropdown">
                                    {this.state.ratesFields}
                                </select>
                            </div>
                        </div>
                    </div>
                </li>
            );
        }
    }

    initRatesChoice() {
        if (localStorage.getItem('rates') == null) {
            window.location.reload();
            console.log('ko')
        }
        let rates = JSON.parse(localStorage.getItem('rates'));
        this.state.ratesFields.push(
            <option value="0" key={this.state.uniqueKey}>
                VOTER
            </option>
        );
        for (let i = 0; i < rates.length; i++) {
            let rate_id = i + 1;
            let rate_value = rates[i].name;
            this.state.ratesFields.push(
                <option value={rate_id} key={this.state.uniqueKey}>
                    {rate_value}
                </option>
            );
            this.state.uniqueKey += 1;
        }
    }

    render() {
        return (
            <div className="container body">
                <div className="row">
                    {/* JUGEMENTS */}
                    <div id="rate"
                         className="col-lg-offset-2 col-lg-8 col-xs-12">
                        <div className="x_panel tile">
                            <div className="x_title">
                                <h2>{localStorage.getItem('ballot_name')}
                                    <small>{localStorage.getItem('ballot_note')}</small>
                                </h2>
                                <div className="clearfix"></div>
                                <p className="change_link" id="status_ws"></p>
                            </div>
                            <div className="clearfix"></div>
                            <form className="form-horizontal">
                                <ul className="collection">
                                    {this.state.candidatesFields.map((value) => {
                                        return value
                                    })}
                                </ul>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 text-center">
                        <button type="button" className="btn btn-primary btn-lg"
                                onClick={evt => this.sendVote(evt)}>SOUMETTRE
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default voter_form;

