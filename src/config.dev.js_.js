import config from 'react-global-configuration';

config.set({
    server_url: 'http://192.168.1.19:8000/',
    options:{
        max_candidates:99,
        max_rates:10,
        rates_gradient: [
            "#04b031",
            "#6eca1c",
            "#ecd203",
            "#ffb200",
            "#ff5d00",
            "#e03007",
            "#e0071c",
            "#b20616",
            "#800410",
            "#9b9897"
        ], //ajouter le nombre de couleurs correspondant au max_rates
        default_rates: [
            "Excellent",
            "Bien",
            "Passable",
            "Insuffisant",
            "A rejeter"
        ],
        max_length_candidate_label:250,
        max_length_candidate_presentation:1000,
        max_length_rate_label:100
    }
});

export default config;


