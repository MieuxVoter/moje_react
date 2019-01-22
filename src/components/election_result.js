import React, {Component} from "react";
import config from 'react-global-configuration';
import Parser from 'html-react-parser';

function sortFunctionMediane(a, b) {
    if (a[3] === b[3]) {
        return 0;
    }
    else {
        return (a[3] > b[3]) ? -1 : 1;
    }
}

class election_result extends Component {
    constructor() {
        super();
        this.state = {
            results: [],
            results_mediane: []
        };
        this.initResult();
    }


    /**********************************************************
     * | name | array des résultats | médiane_str | médiane | *
     *********************************************************/

    initResult() {
        let data = new FormData();
        data.append('username', localStorage.getItem('username'));
        data.append('password', localStorage.getItem('password'));
        data.append('id_election', localStorage.getItem('id_election'));
        fetch(config.get('server_url') + 'ws/supervisor/election/result/', {
            method: 'POST',
            body: data
        })
            .then((resp) => resp.json()) // Transform the data into json
            .then(result => {
                console.log(result);
                if (result.results == null) {
                    window.location.assign('/election_detail');
                }
                let results = result.results;
                let results_tmp = [];
                let mediane_val = 0;

                for (let i = 0; i < results.length; i++) {
                    let pos_in_array = -1;
                    for (let j = 0; j < results_tmp.length; j++) {
                        if (results_tmp[j][0] === results[i].candidate_str) {
                            pos_in_array = j;
                        }
                    }

                    let mediane_multi = 0;
                    switch (results[i].grade_str) {
                        case "Excellent":
                            mediane_multi = 5;
                            break;
                        case "Bien":
                            mediane_multi = 4;
                            break;
                        case "Passable":
                            mediane_multi = 3;
                            break;
                        case "Insuffisant":
                            mediane_multi = 2;
                            break;
                        case "A rejeter":
                            mediane_multi = 1;
                            break;
                    }


                    if (pos_in_array !== -1) {
                        mediane_val += results[i].result;
                        results_tmp[pos_in_array][1].push(results[i].result);
                        if (mediane_val >= 50) {
                            results_tmp[pos_in_array][2] = results[i].grade_str;
                            results_tmp[pos_in_array][3] = mediane_val * mediane_multi;
                            mediane_val = -99999;
                        }
                    }
                    else {
                        mediane_val = 0;
                        mediane_val += results[i].result;
                        if (mediane_val >= 50) {
                            results_tmp.push([results[i].candidate_str, [results[i].result], results[i].grade_str, mediane_val * mediane_multi]);
                            mediane_val = -99999;
                        }
                        else {
                            results_tmp.push([results[i].candidate_str, [results[i].result], "", 0]);
                        }
                    }


                }
                results_tmp.sort(sortFunctionMediane);
                this.setState({results: results_tmp});
            });
    }

    render() {
        let col_width = (100 / this.state.results.length);
        let cpt_rank = 0;
        return (
            <div className="container body">
                <div className="row">
                    <div id="general_information"
                         className="box_placeholder col-lg-offset-1 col-lg-10 col-xs-12">
                        <div className="x_panel tile">
                            <img className="legend" src="/legend.png" />
                            <div className="x_title">
                                <h2>Résultats</h2>
                                <div className="clearfix"></div>
                            </div>
                            <div className="clearfix"></div>
                            <div id="election_result" className="row">
                                <div id="candidate_list" className="col-lg-12">
                                    <img id="bg_chart" src="/bg_chart.gif" alt="bg chart" width="100%" height="100%"/>
                                    <div className="candidate-container">
                                        {console.log(this.state.results)}
                                        {this.state.results.map(function (result) {
                                                let graph_html = "";
                                                for (let i = 0; i !== result[1].length; i++) {
                                                    switch (i) {
                                                        case 0:
                                                            graph_html += "<div class=\"excellent\" style=\"height: " + result[1][i] + "%\"></div>";
                                                            break;
                                                        case 1:
                                                            graph_html += "<div class=\"bien\" style=\"height: " + result[1][i] + "%\"></div>";
                                                            break;
                                                        case 2:
                                                            graph_html += "<div class=\"passable\" style=\"height: " + result[1][i] + "%\"></div>";
                                                            break;
                                                        case 3:
                                                            graph_html += "<div class=\"insuffisant\" style=\"height: " + result[1][i] + "%\"></div>";
                                                            break;
                                                        case 4:
                                                            graph_html += "<div class=\"rejeter\" style=\"height: " + result[1][i] + "%\"></div>";
                                                            break;
                                                    }
                                                }

                                                const props = {
                                                    dangerouslySetInnerHTML: {__html: graph_html},
                                                };

                                                return <div className="candidate" style={{width: col_width + '%'}}>
                                                    <div className="candidate100" {...props}></div>
                                                    <label>{result[0]}</label>
                                                </div>;
                                            }
                                        )}

                                    </div>
                                </div>
                            </div>

                            <div id="election_mediane" className="row">
                                <div className="col-lg-4">
                                    <div className="candidate-container">


                                        <table className="table table-hover">
                                            <tbody>
                                            {this.state.results.map(function (result) {
                                                    cpt_rank += 1;
                                                    let td_class = "";
                                                    switch (result[2]) {
                                                        case "Excellent":
                                                            td_class += "excellent";
                                                            break;
                                                        case "Bien":
                                                            td_class += "bien";
                                                            break;
                                                        case "Passable":
                                                            td_class += "passable";
                                                            break;
                                                        case "Insuffisant":
                                                            td_class += "insuffisant";
                                                            break;
                                                        case "A rejeter":
                                                            td_class += "rejeter";
                                                            break;
                                                    }


                                                    return <tr>
                                                        <td className="row">{cpt_rank}</td>
                                                        <td>{result[0]}</td>
                                                        <td className={td_class}>{result[2]}</td>
                                                    </tr>;
                                                }
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default election_result;

