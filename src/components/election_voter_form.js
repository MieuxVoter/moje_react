import React, {Component} from "react";
import config from 'react-global-configuration';

class election_voter_form extends Component {
    constructor() {
        super();
        this.state = {
            voters: [],
            voterInputFieldId: 0,
            votersInputFields: []
        }
    }

    submitVoterEmail(id_election, email) {
        let data = new FormData();
        data.append('id_election', id_election);
        data.append('email', email);
        fetch(config.get('server_url') + 'ws/election/voter/add/', {
            method: 'POST',
            body: data
        })
            .then(result => {
                if (result.status === 200) {
                    console.log("email send");
                } else {
                    //TODO identification échoué
                }
            })
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
                    console.log("email send");
                } else {
                    //TODO identification échoué
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

    addVoterInput = () => {
        let voterInputFields = this.state.votersInputFields;
        let voterInputFieldId = this.state.voterInputFieldId + 1;
        let id_election = localStorage.getItem('id_election');
        let voter_email_value = document.getElementById('voter_email').value.toLowerCase();
        this.submitVoterEmail(id_election, voter_email_value);
        document.getElementById('voter_email').value = '';

        this.state.voters.push({id: voterInputFieldId, value: voter_email_value});
        voterInputFields.push(
            <tr id={["li_voter_" + voterInputFieldId].join()} key={voterInputFieldId}>
                <td>
                    <div className="x_panel tile overflow_hidden col-lg-12">
                        <p className="voter-email">{voter_email_value}</p><p className="voter-status">n'a pas
                        voté</p>
                    </div>
                </td>
            </tr>);
        this.setState({voterInputFields})
        this.setState({voterInputFieldId})
    }

    changeTab(evt, tabName) {
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with className="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with className="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    validateEmail() {
        let voter_email_value = document.getElementById('voter_email').value.toLowerCase();
        let button_voter_email = document.getElementById('button_voter_email');
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (re.test(String(voter_email_value).toLowerCase())) {
            button_voter_email.disabled = false;
        } else {
            button_voter_email.disabled = true;
        }
    }

    render() {
        return (
            <div className="container body">
                <div className="row">
                    <div className="box_placeholder col-lg-offset-1 col-md-offset-1 col-md-10 col-md-10 col-sm-12">
                        <div className="clearfix"></div>
                        {/* Tab links */}
                        <div className="tab">
                            <button className="tablinks" onClick={evt => this.changeTab(evt, 'voter_add')}>AJOUT
                                D'ÉLECTEURS
                            </button>
                            <button className="tablinks" onClick={evt => this.changeTab(evt, 'voter_list')}>LISTE
                                DES
                                ÉLECTEURS ({this.state.votersInputFields.length})
                            </button>
                        </div>

                        {/* Tab content */}
                        <div id="voter_add" className="tabcontent">
                            <form className="form-horizontal">
                                {/* Voter email */}
                                <div className="form-group">
                                    <div className="col-lg-12">
                                        <input type="text" name="name" id="voter_email"
                                               required="required"
                                               className="form-control col-md-7 col-xs-12"
                                               onChange={evt => this.validateEmail(evt)}/>
                                        <label>Mails à ajouter</label>
                                    </div>
                                </div>
                                <div className="col-md-12 text-center">
                                    <button id="button_voter_email" type="button" className="btn btn-default btn-lg"
                                            onClick={evt => this.addVoterInput(evt)}>+
                                        AJOUTER
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div id="voter_list" className="tabcontent">
                            <table className="table table-striped voter-list">
                                <tbody>

                                {this.state.votersInputFields.length === 0 &&
                                <tr>
                                    <td>
                                        Aucun votant
                                    </td>
                                </tr>
                                }
                                {this.state.votersInputFields.map((value) => {
                                    return value
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <br/>
                <div className="row">
                    {/* INFORMATIONS GÉNÉRALES */}
                    <div id="general_information"
                         className="box_placeholder col-lg-offset-1 col-lg-10 col-sm-12">
                        <div className="x_panel tile">
                            <div className="x_title">
                                <h2>Information générales</h2>
                                <div className="clearfix"></div>
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

export default election_voter_form;

