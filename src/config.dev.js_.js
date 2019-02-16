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
            {position: 0, value: "Excellent"},
            {position: 1, value: "Bien"},
            {position: 2, value: "Passable"},
            {position: 3, value: "Insuffisant"},
            {position: 4, value: "A rejeter"}
        ]
    }
});

export default config;


