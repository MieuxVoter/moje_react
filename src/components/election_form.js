import React, {Component} from "react";
import config from 'react-global-configuration';

class election_form extends Component {
    constructor() {
        super();
        this.is_authenticated();
        this.state = {
            candidates: [],
            candidateInputFieldId: 0,
            candidateInputFields: [],
            rates: [
                {"id": 1, "value": "Excellent"},
                {"id": 2, "value": "Bien"},
                {"id": 3, "value": "Passable"},
                {"id": 4, "value": "Insuffisant"},
                {"id": 5, "value": "A rejeter"}
            ],
            rateInputFieldId: 0,
            rateInputFields: [],
            voterInput: [],
            electionId: null,
            electionCreationProgress: false
        }
        this.initRateInput();

    }

    init_election_date(id) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }

        today = yyyy+'-'+mm+'-'+dd;
        document.getElementById(id).setAttribute("value", today);
        document.getElementById(id).setAttribute("min", today);
    }

    is_authenticated() {
        if (localStorage.getItem('username') === null && localStorage.getItem('password') === null) {
            fetch(config.get('server_url') + 'ws/data/log-in/', {
                method: 'POST',
                body: {
                    username: localStorage.getItem('username'),
                    password: localStorage.getItem('password')
                }
            })
                .then(result => {
                    if (result.status !== 200) {
                        window.location.assign('/log-in');
                    }
                });
        }
    }

    setBallotInformation(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        // https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f

        let ballot_name = document.getElementById('ballot-name').value;
        let ballot_note = document.getElementById('ballot-note').value;
        let anonymous = null;
        if (document.getElementById("anonymous").checked === true) {
            anonymous = "false";
        } else {
            anonymous = "true";
        }

        /*
        let start_election_date = null;
        if (document.getElementById("toggle-start-date-time").checked === true) {
            start_election_date = document.getElementById('start_election_date').value;
            data.set('start_election_date', start_election_date);
        }
        */
        let end_election_date = null;
        if (document.getElementById("toggle-end-date-time").checked === true) {
            end_election_date = document.getElementById('end_election_date').value;
            data.set('end_election_date', end_election_date);
        }

        localStorage.setItem('ballot_name', ballot_name);
        localStorage.setItem('ballot_note', ballot_note);

        data.set('username', String(localStorage.getItem('username')));
        data.set('password', String(localStorage.getItem('password')));
        data.set('name', String(localStorage.getItem('ballot_name')));
        data.set('note', String(localStorage.getItem('ballot_note')));
        data.set('grades', String(localStorage.getItem('rates')));
        data.set('candidates', String(localStorage.getItem('candidates')));
        data.set('anonymous', anonymous);


        fetch(config.get('server_url') + 'ws/election/create/', {
            method: 'POST',
            body: data,
        })
            .then((resp) => resp.json()) // Transform the data into json
            .then(function (result) {
                localStorage.setItem('id_election', result.id_election);
                window.location.assign('/election_finalize');
            })
            .catch(function () {
                // This is where you run code if the server returns any errors
            });
    }

    addCandidateInput = () => {
        let candidateInputFields = this.state.candidateInputFields;
        let candidateInputFieldId = this.state.candidateInputFieldId + 1;
        let proposition_value = document.getElementById('proposition_input').value;
        document.getElementById('proposition_input').value = '';
        this.state.candidates.push({id: candidateInputFieldId, value: proposition_value});
        let candidatesJson = this.state.candidates;
        localStorage.setItem('candidates', JSON.stringify(candidatesJson));
        candidateInputFields.push(
            <li id={["li_candidate_" + candidateInputFieldId].join()} key={candidateInputFieldId}>
                <div className="x_panel tile overflow_hidden">
                    <div className="x_title">
                        <h2>Proposition {candidateInputFieldId} : {proposition_value}</h2>
                        <ul className="nav navbar-right panel_toolbox">
                            <li className="dropdown">
                                <a href="#edit" className="dropdown-toggle" data-toggle="dropdown" role="button"
                                   aria-expanded="false"><i className="fa fa-edit"></i></a>
                            </li>
                            <li><a href="#delete" className="close-link"
                                   onClick={proposition_value => this.removeCandidateInput(candidateInputFieldId)}><i
                                className="fa fa-close"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>);
        this.setState({candidateInputFields})
        this.setState({candidateInputFieldId})
    }

    initRateInput() {
        let rates = this.state.rates;
        localStorage.setItem('rates', JSON.stringify(rates));
        let rateInputFields = this.state.rateInputFields;
        for (let p in rates) {
            if (rates.hasOwnProperty(p)) {
                let rate_id = rates[p].id;
                let rate_value = rates[p].value;
                rateInputFields.push(
                    <li id={["li_rate_" + rate_id].join()} key={rate_id}>
                        <div className="x_panel tile overflow_hidden">
                            <div className="x_title">
                                <h2>{rate_value}</h2>
                                <ul className="nav navbar-right panel_toolbox">
                                    <li className="dropdown">
                                        <a href="#edit" className="dropdown-toggle" data-toggle="dropdown" role="button"
                                           aria-expanded="false"><i className="fa fa-edit"></i></a>
                                    </li>
                                    <li><a href="#delete" className="close-link"
                                           onClick={rate_value => this.removeRateInput(rate_id)}><i
                                        className="fa fa-close"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>);
                this.state.rateInputFieldId = rate_id;
            }
        }
    }

    addRateInput = () => {
        let rateInputFields = this.state.rateInputFields;
        let rateInputFieldId = this.state.rateInputFieldId + 1;
        let rate_value = document.getElementById('rate_input').value;
        document.getElementById('rate_input').value = '';

        this.state.rates.push({id: rateInputFieldId, value: rate_value});
        let ratesJson = this.state.rates;
        localStorage.setItem('rates', JSON.stringify(ratesJson));
        rateInputFields.push(
            <li id={["li_rate_" + rateInputFieldId].join()} key={rateInputFieldId}>
                <div className="x_panel tile overflow_hidden">
                    <div className="x_title">
                        <h2>{rate_value}</h2>
                        <ul className="nav navbar-right panel_toolbox">
                            <li className="dropdown">
                                <a href="#edit" className="dropdown-toggle" data-toggle="dropdown" role="button"
                                   aria-expanded="false"><i className="fa fa-edit"></i></a>
                            </li>
                            <li><a href="#delete" className="close-link"
                                   onClick={rate_value => this.removeRateInput(rateInputFieldId)}><i
                                className="fa fa-close"></i></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>);
        this.setState({rateInputFields})
        this.setState({rateInputFieldId})
    }

    removeCandidateInput = (id) => {
        let elem = document.getElementById('li_candidate_' + id);
        elem.parentNode.removeChild(elem);

        let data = this.state.candidates.filter(i => i.id !== id);
        this.setState({candidates: data});
    }

    removeRateInput = (id) => {
        let elem = document.getElementById('li_rate_' + id);
        elem.parentNode.removeChild(elem);

        let data = this.state.rates.filter(i => i.id !== id);
        this.setState({rates: data});
    }

    toggleStartDateTime() {

        this.init_election_date('start_election_date');
        if (document.getElementById('toggle-start-date-time').checked === true) {
            document.getElementById('start_election_date').style.display = "block";
        } else {
            document.getElementById('start_election_date').style.display = "none";
        }
    }

    toggleEndDateTime() {
        this.init_election_date('end_election_date');
        if (document.getElementById('toggle-end-date-time').checked === true) {
            document.getElementById('end_election_date').style.display = "block";
        } else {
            document.getElementById('end_election_date').style.display = "none";
        }
    }

    render() {
        return (
            <div className="container body">
                <div className="row">


                    {/* INFORMATIONS GÉNÉRALES */}
                    <div id="general_information"
                         className="box_placeholder col-lg-offset-1 col-md-offset-1 col-md-5 col-sm-5 col-xs-12">
                        <div className="x_panel tile">
                            <div className="x_title">
                                <h2>Information générales</h2>
                                <div className="clearfix"></div>
                            </div>
                            <div className="clearfix"></div>
                            <p className="example">Le vote au jugement majoritaire fonctionne à partir d'une phrase, qui
                                cadre l'élection.
                                Ex. "Pour être maire de la ville de Bordeaux, je juge en conscience que ce candidat
                                serait : "</p>
                            <form className="form-horizontal">
                                {/* Ballot name */}
                                <div className="form-group">
                                    <div className="col-lg-12">
                                        <input type="text" name="name" id="ballot-name"
                                               required="required"
                                               className="form-control col-md-7 col-xs-12"/>
                                        <label>Titre du scrutin*</label>
                                    </div>
                                </div>

                                {/* Ballot description */}
                                <div className="form-group">
                                    <div className="col-lg-12">
                                        <input type="text" name="note" id="ballot-note"
                                               required="required"
                                               className="form-control col-md-7 col-xs-12"/>
                                        <label>Description du scrutin*</label>
                                    </div>
                                </div>

                                {/* Election start date */}
                                {/*<div className="form-group">
                                    <div className="col-lg-12 anonymous">
                                        <input type="checkbox" id="toggle-start-date-time" name="toggle-start-date-time" onClick={evt => this.toggleStartDateTime(evt)}/>
                                        <label id="toggle-start-date-time-label">Programmer la date de début de l'élection.</label>
                                        <input type="date" id="start_election_date" max="2100-06-25" name="start_date_election"/>

                                    </div>
                                </div>*/}

                                {/* Election end date */}
                                <div className="form-group">
                                    <div className="col-lg-12 anonymous">
                                        <input type="checkbox" id="toggle-end-date-time" name="toggle-end-date-time" onClick={evt => this.toggleEndDateTime(evt)}/>
                                        <label id="toggle-end-date-time-label">Programmer la date de fin de l'élection.</label>
                                        <input type="date" id="end_election_date" max="2100-06-25" name="end_date_election"/>

                                    </div>
                                </div>

                                {/* Allow store ballot*/}
                                <div className="form-group">
                                    <div className="col-lg-12 anonymous">
                                        <input type="checkbox" id="anonymous" name="anonymous"/>
                                        <label id="anonymous_label">Autoriser l’utilisation des votes anonymisés à des
                                            buts de recherche.</label>

                                        <p className="example">Cette option sauvegarde en double les votes : dans
                                            Belenios et dans moje.</p>
                                    </div>

                                </div>

                            </form>
                        </div>
                    </div>

                    {/* PROPOSITIONS */}
                    <div id="proposition" className="box_placeholder col-md-5 col-sm-5 col-xs-12">
                        <div className="x_panel tile">
                            <div className="x_title">
                                <h2>Propositions soumises au vote</h2>
                                <div className="clearfix"></div>
                            </div>
                            <div className="clearfix"></div>
                            <ul className="collection">

                                {this.state.candidateInputFields.length === 0 &&
                                <li>
                                    <div className="x_panel tile overflow_hidden">
                                        <div className="x_title">
                                            <h2>Aucune proposition</h2>
                                        </div>
                                    </div>
                                </li>
                                }
                                {this.state.candidateInputFields.map((value) => {
                                    return value
                                })}
                            </ul>
                            <form className="form-horizontal">
                                <div className="form-group">
                                    <div className="col-lg-12">
                                        <input type="text" id="proposition_input" name="candidate"
                                               className="form-control col-lg-12"
                                               required="required"/>
                                        <label>Nouvelle proposition</label>
                                    </div>
                                </div>

                                <div className="col-md-12 text-center">
                                    <button type="button" className="btn btn-default btn-lg"
                                            onClick={evt => this.addCandidateInput(evt)}>+
                                        AJOUTER
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="row">

                    <div className="col-md-12 text-center">

                        <button type="button" className="btn btn-primary btn-lg"
                                onClick={evt => this.setBallotInformation(evt)}>Valider
                        </button>
                    </div>
                </div>

            </div>
        );
    }
}

export default election_form;

