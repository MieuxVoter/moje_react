import React, {Component} from "react";
import config from 'react-global-configuration';
import {Collapse, Card, CardBody, CardHeader, Alert} from 'reactstrap';
import CheckboxSwitch from "./formComponents/CheckboxSwitch";
import ButtonWithConfirm from "./formComponents/ButtonWithConfirm";
import DatePicker from 'react-datepicker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

class election_form extends Component {

    constructor(props) {
        super(props);

        this.is_authenticated();

        this._candidateLabelInput = React.createRef();
        this._addCandidateButton = React.createRef();
        this._rateLabelInput = React.createRef();
        this._addRateButton = React.createRef();

        this.state = {
            hasEndDate: false,
            endDate : Date.now(),
            hasStartDate: false,
            startDate: Date.now(),
            hasCustomRates : false,
            candidates: [],
            isAddCandidateOpen: false,
            rates: config.get("options").default_rates,
            rateColors:[],
            isAddRateOpen: false,
        };

        this.gradientColors=config.get("options").rates_gradient;
        this.state.rateColors=this.getRatesColors(this.state.rates);

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

    addCandidate = (evt) => {
        if (evt.type === "click" || (evt.type === "keydown" && evt.keyCode === 13)) {
            const candidateFieldValue = this._candidateLabelInput.current.value;
            let candidatesJson = this.state.candidates;
            if(candidatesJson.length<config.get("options").max_candidates){
                candidatesJson.push({ value: candidateFieldValue});
                candidatesJson.map((obj,index) => {obj.id=index} );
                this._candidateLabelInput.current.value = '';
                this.setState({isAddCandidateOpen: false,candidates:candidatesJson});
            }

        }

    };

    removeCandidate = (id) => {
        let candidatesJson = this.state.candidates.filter(i => i.id !== id);
        candidatesJson.map((obj,index) => {obj.id=index} );
        this.setState({candidates: candidatesJson});
    };

    addRate = (evt) => {

        if (evt.type === "click" || (evt.type === "keydown" && evt.keyCode === 13)) {
            const rateFieldValue = this._rateLabelInput.current.value;
            let ratesJson = this.state.rates;
            if(ratesJson.length<config.get("options").max_rates){
                ratesJson.push({value: rateFieldValue});
                ratesJson.map((obj,index) => {obj.id=index} );
                const rateColors=this.getRatesColors(ratesJson);
                this._rateLabelInput.current.value = '';
                this.setState({isAddRateOpen: false,rates:ratesJson, rateColors:rateColors });
            }
        }

    };


    removeRate = (id) => {
        let ratesJson = this.state.rates.filter(i => i.id !== id);
        ratesJson.map((obj,index) => {obj.id=index} );
        let rateColors=this.getRatesColors(ratesJson);
        this.setState({rates: ratesJson,rateColors:rateColors});
    };


    toggleAddCandidate = () => {
        if(this.state.candidates.length >= config.get("options").max_candidates){
            toast.error("Vous ne pouvez plus ajouter de proposition ! ("+config.get("options").max_candidates+" max.)", {
                position: toast.POSITION.TOP_CENTER
            });
        }else{
            this._candidateLabelInput.current.value = "";
            this.setState({
                isAddCandidateOpen: !this.state.isAddCandidateOpen
            });
        }


    };

    toggleAddRate = () => {
        if(this.state.rates.length >= config.get("options").max_rates){
            toast.error("Vous ne pouvez plus ajouter de mentions ! ("+config.get("options").max_rates+" max.)", {
                position: toast.POSITION.TOP_CENTER
            });
        }else {
            this._rateLabelInput.current.value = "";
            this.setState({
                isAddRateOpen: !this.state.isAddRateOpen
            });
        }

    };

    getRatesColors = (ratesJson) => {
        let rateColors= [];
        const step=Math.floor(10/ratesJson.length);
        for(let i=0;i<ratesJson.length;i++){
            rateColors[i]=this.gradientColors[i*step];
        }
        return rateColors;
    };

    toggleHasEndDate = () => {
        this.setState({
            hasEndDate: !this.state.hasEndDate
        });
    };

    toggleHasStartDate = () => {
        this.setState({
            hasStartDate: !this.state.hasStartDate
        });
    };

    toggleHasCustomRate = () => {
        this.setState({
            hasCustomRate: !this.state.hasCustomRate
        });
    };


    render() {
        return (
            <div className="container">
                <ToastContainer />
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
                        <b>{this.state.candidates.length}
                            {(this.state.candidates.length < 2) ? <span> Proposition soumise </span> :
                                <span> Propositions soumises </span>}
                            au vote</b>
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col-12">
                        <div className="collection">
                            {this.state.candidates.map((obj,index) => {
                               return (<div key={"rowCandidate"+index}>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend ">
                                            <span className="input-group-text indexNumber">{index+1}</span>
                                        </div>
                                        <input type="text" className="form-control" defaultValue={obj.value} />
                                        <div className="input-group-append">
                                            <ButtonWithConfirm className="btn btn-outline-danger">
                                                <div key="button"><i className="fas fa-trash-alt"/></div>
                                                <div key="modal-title">Suppression ?</div>
                                                <div key="modal-body">Êtes-vous sûr de vouloir supprimer la proposition suivante ?<br /><i>{obj.value}}</i></div>
                                                <div key="modal-confirm" onClick={() => this.removeCandidate(obj.id)}>Oui</div>
                                                <div key="modal-cancel">Non</div>
                                            </ButtonWithConfirm>
                                        </div>
                                    </div>
                                </div>)
                            })}
                        </div>
                    </div>
                </div>
                <div className="row mt-2">

                    <div className="col-12">
                        <Collapse isOpen={this.state.isAddCandidateOpen}
                                  onEntered={() => {
                                      this._candidateLabelInput.current.focus()
                                  }}
                                  onExited={() => {
                                      this._addCandidateButton.current.focus()
                                  }}>


                            <Card>
                                <CardHeader>Ajout d'une proposition ({config.get("options").max_candidates} max.) </CardHeader>
                                <CardBody>
                                    <div className="row">
                                        <div className="col-12">
                                            <label htmlFor="proposition_label"><b>Libellé</b> <span
                                                className="text-muted">(obligatoire)</span></label>
                                            <input type="text" className="form-control" name="proposition_label"
                                                   id="proposition_label" onKeyDown={evt => this.addCandidate(evt)}
                                                   ref={this._candidateLabelInput}
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
                                                    onClick={evt => this.addCandidate(evt)}>
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
                            <button className="btn btn-primary" tabIndex="3" ref={this._addCandidateButton}
                                    name="collapseAddCandidate"
                                    id="collapseAddCandidate" onClick={this.toggleAddCandidate}>
                                <i className="fas fa-plus-square mr-2"/>Ajouter une proposition</button>}

                    </div>

                </div>




                <div className="row mt-5">
                    <div className="col-12">
                        <b>Options du scrutin</b>
                    </div>
                </div>

                <div className="row  mb-3 mt-3">
                    <div className="col-auto">
                        <CheckboxSwitch id="allowed_sending_anonymous_data" name="allowed_sending_anonymous_data" />
                    </div>
                    <div className="col-8">
                        <label htmlFor="allowed_sending_anonymous_data" className="pl-2">Autoriser l’utilisation des votes anonymisés à
                            des
                            buts de recherche.</label>
                    </div>
                </div>

                <div className="row mb-3 mt-3">
                    <div className="col-auto">
                        <CheckboxSwitch id="has_start_date" name="has_start_date"
                                        onClick={this.toggleHasStartDate}/>
                    </div>
                    <div className="col">
                        <label htmlFor="has_start_date" className="pl-2">Programmer une date de début</label>
                        <div>
                            <Collapse isOpen={this.state.hasStartDate}>

                                <Alert color="secondary" >

                                    {/*<input type="date" id="end_election_date" max="2100-06-25" name="end_date_election"/>*/}
                                    <span><b>Date de début :</b></span> <DatePicker id="start_election_date" name="start_date_election" className="ml-2"
                                                                                    selected={this.state.startDate}
                                                                                    onChange={(date) => {  this.setState({ startDate:date })  }}

                                /></Alert>
                            </Collapse>
                        </div>
                    </div>
                </div>

                <div className="row mb-3 mt-3">
                    <div className="col-auto">
                        <CheckboxSwitch id="has_end_date" name="has_end_date"
                                        onClick={this.toggleHasEndDate}/>
                    </div>
                    <div className="col">
                        <label htmlFor="has_end_date" className="pl-2">Programmer une date de fin</label>
                        <div>
                            <Collapse isOpen={this.state.hasEndDate}>
                                <Alert color="secondary" >
                                    <span><b>Date de fin :</b></span>  <DatePicker id="end_election_date" name="end_date_election" className="ml-2"
                                                                                   selected={this.state.endDate}
                                                                                   onChange={(date) => {  this.setState({ endDate:date })  }}

                                /></Alert>
                            </Collapse>
                        </div>
                    </div>
                </div>


                <div className="row  mb-3 mt-3">
                    <div className="col-auto">
                        <CheckboxSwitch id="has_custom_rates" name="has_custom_rates"  onClick={this.toggleHasCustomRate}/>
                    </div>
                    <div className="col-8">
                        <label htmlFor="has_custom_rates" className="pl-2">Personnaliser les mentions</label>

                    </div>
                </div>


                <div className="row">
                    <div className="col-12">
                        <div>
                            <Collapse isOpen={this.state.hasCustomRate}>
                                <Alert color="secondary" >
                                    <div className="row ">
                                        <div className="col-12">
                                            <b>{this.state.rates.length}
                                                {(this.state.rates.length < 2) ? <span> mention </span> :
                                                    <span> mentions </span>}
                                            </b>
                                            <div className="text-muted">Classez les mentions de la plus positive à la plus négatives</div>
                                        </div>
                                    </div>

                                    <div className="row mt-2">
                                        <div className="col-12">
                                            <div className="collection">
                                                {this.state.rates.map((obj,index) => {
                                                    return (<div key={"rowRate"+index}>
                                                        <div className="input-group mb-3">
                                                            <div className="input-group-prepend ">
                                                                <span className="input-group-text indexNumber"  style={ {color:"#ffffff", backgroundColor : this.state.rateColors[index]} }>{index+1}</span>
                                                            </div>
                                                            <input type="text"  className="form-control" defaultValue={obj.value} />
                                                            <div className="input-group-append">
                                                                <ButtonWithConfirm className="btn btn-outline-danger">
                                                                    <div key="button"><i className="fas fa-trash-alt"/></div>
                                                                    <div key="modal-title">Suppression ?</div>
                                                                    <div key="modal-body">Êtes-vous sûr de vouloir supprimer la mention suivante ?<br /><i>{obj.value}</i></div>
                                                                    <div key="modal-confirm" onClick={() => this.removeRate(obj.id)}>Oui</div>
                                                                    <div key="modal-cancel">Non</div>
                                                                </ButtonWithConfirm>
                                                            </div>
                                                        </div>
                                                    </div>)
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">

                                        <div className="col-12">
                                            <Collapse isOpen={this.state.isAddRateOpen}
                                                      onEntered={() => {
                                                          this._rateLabelInput.current.focus()
                                                      }}
                                                      onExited={() => {
                                                          this._addRateButton.current.focus()
                                                      }}>


                                                <Card>
                                                    <CardHeader>Ajout d'une mention ({config.get("options").max_candidates} max.)</CardHeader>
                                                    <CardBody>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <label htmlFor="proposition_label"><b>Libellé</b> <span
                                                                    className="text-muted">(obligatoire)</span></label>
                                                                <input type="text" className="form-control" name="proposition_label"
                                                                       id="proposition_label" onKeyDown={evt => this.addRate(evt)}
                                                                       ref={this._rateLabelInput}
                                                                       placeholder="Excellent, Trés bien, bien ..."/>
                                                            </div>
                                                        </div>
                                                        <div className="row mt-2">
                                                            <div className="col-md-12 text-right">
                                                                <button type="button" className="btn btn-secondary mr-2"
                                                                        onClick={this.toggleAddRate}>
                                                                    <i className="fas fa-times mr-2"/>Annuler
                                                                </button>
                                                                <button type="button" className="btn btn-success "
                                                                        onClick={evt => this.addRate(evt)}>
                                                                    <i className="fas fa-plus mr-2"/>Ajouter
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card>


                                            </Collapse>
                                        </div>

                                        <div className="col-12">
                                            {this.state.isAddRateOpen ? null :
                                                <button className="btn btn-primary" tabIndex="3" ref={this._addRateButton}
                                                        name="collapseAddRate"
                                                        id="collapseAddRate" onClick={this.toggleAddRate}>
                                                    <i className="fas fa-plus-square mr-2"/>Ajouter une mention</button>}

                                        </div>

                                    </div>

                                </Alert>
                            </Collapse>
                        </div>
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

