import React, {Component} from "react";
import config from 'react-global-configuration';

class help extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div id="dashboard" className="container body">
                <div className="row">
                    <div className="col-lg-offset-1 col-md-offset-1 col-lg-10 col-xs-12 text-center">
                        <h1>Le jugement majoritaire</h1>
                        <p>Ce mode de scrutin donne la possibilité aux électeurs de s'exprimer sur tous les candidats.
                            Cela permet de ne pas avoir à choisir entre plusieurs candidats auxquels on adhère. Ce qui
                            limite fortement la possibilité de résultats paradoxaux.</p>
                        <p>Le jugement majoritaire est un nouveau système de vote développé par deux chercheurs CNRS
                            (organisateurs de cette expérience) comme remède aux maladies du scrutin majoritaire. Il
                            repose sur une théorie mathématique développée depuis une dizaine d’années et publiée dans
                            un livre paru chez MIT Press en 2011. Chaque électeur attribue à chaque candidat/e une
                            mention «Très bien», «Bien», «Assez bien», «Passable», «Insuffisant» ou «A Rejeter». Le/la
                            candidat/e élu/e est celui ou celle qui obtient la meilleure mention soutenue par une
                            majorité. Au cas où deux candidat(e)s ont la même mention majoritaire, celui ou celle qui
                            gagne (ou perd) est celui ou celle avec le plus d'électeurs lui attribuants strictement plus
                            (ou strictement moins) que sa mention majoritaire.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default help;

