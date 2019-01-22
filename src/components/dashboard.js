import React, {Component} from "react";
import config from 'react-global-configuration';

class dashboard extends Component {
    constructor() {
        super();
        this.state = {
            elections: [],
            electionsStartedFields: []
        }
        this.get_supervisor_election();
    }

    get_supervisor_election() {
        let data = new FormData();
        data.append('username', localStorage.getItem('username'));
        data.append('password', localStorage.getItem('password'));
        fetch(config.get('server_url') + 'ws/supervisor/election/list/', {
            method: 'POST',
            body: data
        })
            .then((resp) => resp.json()) // Transform the data into json
            .then(data => this.setState({elections: data}))
            .catch(function () {
                // This is where you run code if the server returns any errors
            });
    }

    show_election(id_election) {
        localStorage.setItem('id_election', id_election);
        window.location.assign('/election_result');
    }


    render() {
        return (
            <div id="dashboard" className="container body">
                <div className="row">
                    <div className="col-lg-offset-1 col-md-offset-1 col-lg-10 col-xs-12 text-center">
                        <h1>Scrutins en cours</h1>
                        {this.state.elections.length === 0 &&
                        <span>Aucun scrutin en cours</span>
                        }
                        {this.state.elections.map(election => {
                                return election.election.state === "ST" &&
                                    <div key={election.election.id} className="dashcontent"
                                         onClick={evt => this.show_election(election.election.id)}>
                                        <div className="row row-eq-height">
                                            <div className="col-lg-10 col-xs-12">
                                                <h2 className="text-left">{election.election.name}
                                                    <small> - {election.election.note}</small>
                                                </h2>
                                            </div>
                                            {/*<div className="col-lg-2 col-xs-12 right_col election_state vcenter bg-primary">
                                                <i className="fa fa-lg fa-envelope-o">0 / 0</i>
                                            </div>*/}
                                        </div>
                                    </div>
                            }
                        )}
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-offset-1 col-md-offset-1 col-lg-10 col-xs-12 text-center">
                        <h1>Scrutins cloturés</h1>
                        {this.state.elections.length === 0 &&
                        <span>Aucun scrutin cloturés</span>
                        }
                        {this.state.elections.map(election => {
                                return election.election.state === "OV" &&
                                    <div key={election.election.id} className="dashcontent"
                                         onClick={evt => this.show_election(election.election.id)}>
                                        <div className="row row-eq-height">
                                            <div className="col-lg-10 col-xs-12">
                                                <h2 className="text-left">{election.election.name}
                                                    <small> - {election.election.note}</small>
                                                </h2>
                                            </div>
                                            {/*<div
                                                className="col-lg-2 col-xs-12 right_col election_state vcenter bg-secondary">
                                                <i className="fa fa-lg fa-envelope-o">0 / 0</i>
                                            </div>*/}
                                        </div>
                                    </div>
                            }
                        )}
                    </div>
                </div>

            </div>
        );
    }
}

export default dashboard;

