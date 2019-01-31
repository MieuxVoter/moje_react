import React, {Component} from "react";
import config from 'react-global-configuration';
import {Collapse, Card, CardBody, CardHeader} from 'reactstrap';
import CheckboxSwitch from "./CheckboxSwitch";
import ModalConfirm from "./ModalConfirm";

class election_form extends Component {

    constructor(props) {
        super(props);
        this.is_authenticated();
        this._propositionLabelInput = React.createRef();
        this._addPropositionButton = React.createRef();
        this._removePropositionModalConfirm = React.createRef();
        this.state = {
            candidates: [],
            propositionsFieldId: 0,
            propositionsFields: [],
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
            electionCreationProgress: false,
            isAddCandidateOpen: false,
            hasDateEnd: false,
            hasDateStart: false
        };
        this.initRateInput();

    }


    init_election_date(id) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }

        today = yyyy + '-' + mm + '-' + dd;
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

    monTest = () => {
        alert('ok');
    };

    addCandidateInput = (evt) => {
        if (evt.type === "click" || (evt.type === "keydown" && evt.keyCode === 13)) {
            let propositionsFields = this.state.propositionsFields;
            let propositionsFieldId = this.state.propositionsFieldId + 1;
            let propositionFieldValue = this._propositionLabelInput.current.value;
            let key = "propositionDiv" + propositionsFieldId;
            this._propositionLabelInput.current.value = '';
            this.state.candidates.push({id: propositionsFieldId, value: propositionFieldValue});
            let candidatesJson = this.state.candidates;
            localStorage.setItem('candidates', JSON.stringify(candidatesJson));
            propositionsFields.push(<div key={key}>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">{propositionsFieldId}</span>
                    </div>
                    <input type="text"  className="form-control" value={propositionFieldValue}
                           aria-label="Amount (to the nearest dollar)"/>
                    <div className="input-group-append">

                        <button className="btn btn-outline-danger" type="button" onClick={() => {
                            this._removePropositionModalConfirm.current.toggle()
                        }}><i className="fas fa-trash-alt"/></button>
                        <ModalConfirm title="Confirmation" confirmButtonText="Ok" confirmCallback={this.monTest}
                                      cancelButtonText="Annuler" ref={this._removePropositionModalConfirm}>Êtes-vous sûr
                            de vouloir supprimer cette proposition ?</ModalConfirm>
                    </div>
                </div>
            </div>);
            this.setState({propositionsFields});
            this.setState({propositionsFieldId});
            this.setState({isAddCandidateOpen: false});
        }

    };


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
        let rate_value = document.getElementById('rate_Input').value;
        document.getElementById('rate_Input').value = '';
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
    };

    removeCandidateInput = (id) => {
        let elem = document.getElementById('li_candidate_' + id);
        elem.parentNode.removeChild(elem);
        let data = this.state.candidates.filter(i => i.id !== id);
        this.setState({candidates: data});
    };

    removeRateInput = (id) => {
        let elem = document.getElementById('li_rate_' + id);
        elem.parentNode.removeChild(elem);
        let data = this.state.rates.filter(i => i.id !== id);
        this.setState({rates: data});
    };

    confirmBeforeRemoveProposition = () => {
        this._removePropositionModalConfirm.current.toggle();
    };

    toggleAddCandidate = () => {
        this._propositionLabelInput.current.value = "";
        this.setState({
            isAddCandidateOpen: !this.state.isAddCandidateOpen
        });

    };

    toggleHasDateEnd = () => {
        this.setState({
            hasDateEnd: !this.state.hasDateEnd
        });
    };

    toggleHasDateStart = () => {
        this.setState({
            hasDateStart: !this.state.hasDateStart
        });
    };

    setFocusOnPropositionLabelInput = () => {
        this._propositionLabelInput.current.focus();
    }

    setFocusOnAddPropositionButton = () => {
        this._addPropositionButton.current.focus();
    };

    render() {
        return (
            <div className="container">

                <div className="row">
                    <div className="col-12">
                        <h1>Nouveau Scrutin</h1>
                        <hr/>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12">
                        <label htmlFor="author"><b>Titre du scrutin</b> <span
                            className="text-muted">(obligatoire)</span></label>
                        <input type="text" name="name" id="ballot-name"
                               required="required" className="form-control" maxLength="250" autoFocus tabIndex="1"
                               placeholder="Titre"/>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12">
                        <label htmlFor="author"><b>Description du scrutin</b> <span
                            className="text-muted">(obligatoire)</span></label>
                        <textarea name="note" id="ballot-note"
                                  required="required" className="form-control" maxLength="500" tabIndex="2"
                                  placeholder="Description" rows="5"/>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12">
                        <b>Options du scrutin</b>
                    </div>
                </div>
                <div className="row mb-3 mt-3">
                    <div className="col-auto">
                        <CheckboxSwitch id="toggle-end-date-time" name="toggle-end-date-time" tabIndex="3"
                                        onClick={this.toggleHasDateStart}/>
                    </div>
                    <div className="col-8">
                        <label id="toggle-end-date-time-label" className="pl-2">Programmer une date de début</label>
                        <div>
                            <Collapse isOpen={this.state.hasDateStart}>
                                <input type="date" id="end_election_date" max="2100-06-25" name="end_date_election"/>
                            </Collapse>
                        </div>
                    </div>
                </div>

                <div className="row mb-3 mt-3">
                    <div className="col-auto">
                        <CheckboxSwitch id="toggle-end-date-time" name="toggle-end-date-time" tabIndex="4"
                                        onClick={this.toggleHasDateEnd}/>
                    </div>
                    <div className="col-8">
                        <label id="toggle-end-date-time-label" className="pl-2">Programmer une date de fin</label>
                        <div>
                            <Collapse isOpen={this.state.hasDateEnd}>
                                <input type="date" id="end_election_date" max="2100-06-25" name="end_date_election"/>
                            </Collapse>
                        </div>
                    </div>
                </div>

                <div className="row  mb-3 mt-3">
                    <div className="col-auto">
                        <CheckboxSwitch id="anonymous" name="anonymous" tabIndex="5"/>
                    </div>
                    <div className="col-8">
                        <label id="anonymous_label" className="pl-2">Autoriser l’utilisation des votes anonymisés à
                            des
                            buts de recherche.</label>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12">
                        <b>{this.state.propositionsFields.length}
                            {(this.state.propositionsFields.length < 2) ? <span> Proposition soumise </span> :
                                <span> Propositions soumises </span>}
                            au vote</b>
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col-12">
                        <div className="collection">
                            {this.state.propositionsFields.map((value) => {
                                return value
                            })}
                        </div>
                    </div>
                </div>
                <div className="row mt-2">

                    <div className="col-12">
                        <Collapse isOpen={this.state.isAddCandidateOpen}
                                  onEntered={() => {
                                      this._propositionLabelInput.current.focus()
                                  }}
                                  onExited={() => {
                                      this._addPropositionButton.current.focus()
                                  }}>


                            <Card>
                                <CardHeader>Ajout d'une proposition</CardHeader>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-12">
                                            <label htmlFor="proposition_label"><b>Libellé</b> <span
                                                className="text-muted">(obligatoire)</span></label>
                                            <input type="text" className="form-control" name="proposition_label"
                                                   id="proposition_label" onKeyDown={evt => this.addCandidateInput(evt)}
                                                   ref={this._propositionLabelInput}
                                                   placeholder="Nom de la proposition, nom du candidat, etc..."/>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-12 text-right">
                                            <button type="button" className="btn btn-secondary mr-2"
                                                    onClick={this.toggleAddCandidate}>
                                                <i className="fas fa-times mr-2"/>Annuler
                                            </button>
                                            <button type="button" className="btn btn-success "
                                                    onClick={evt => this.addCandidateInput(evt)}>
                                                <i className="fas fa-plus mr-2"/>Ajouter
                                            </button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>


                        </Collapse>
                    </div>

                    <div className="col-12">
                        {this.state.isAddCandidateOpen ? null :
                            <button className="btn btn-primary" tabIndex="6" ref={this._addPropositionButton}
                                    name="collapseAddCandidate"
                                    id="collapseAddCandidate" onClick={this.toggleAddCandidate}>
                                <i className="fas fa-plus-square mr-2"/>Ajouter une proposition</button>}

                    </div>

                </div>

                <div className="row mt-5">

                    <div className="col-12 text-right">
                        <hr/>

                        <button type="button" tabIndex="7"  className="btn btn-success btn-lg"
                                onClick={evt => this.setBallotInformation(evt)}><i
                            className="fas fa-check mr-2"/>Démarrer <span
                            className="d-none d-md-inline">ce scrutin</span>
                        </button>

                    </div>
                </div>


            </div>

        )
    }


}

export default election_form;

