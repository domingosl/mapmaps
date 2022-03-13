const constellations = {
    world: {
        title: "The world map of humanity problems",
        source: {name: null, url: null},
        options: require('../constellation-defaults/world')
    },
    "starships-and-tokens": {
        title: "The civilization graph (The map)",
        source: {name: "Starships and tokens", url: 'https://medium.com/@trentmc0/starships-and-tokens-d8c32728a24b'},
        options: require('../constellation-defaults/world')
    },
    "human-stress": {
        title: "Stress disorders in human beings",
        source: {
            name: "UIA",
            url: "http://encyclopedia.uia.org/"
        },
        options: require('../constellation-defaults/stress-humans')
    },
    "corruption": {
        title: "Corruption",
        source: {
            name: "UIA",
            url: "http://encyclopedia.uia.org/"
        },
        options: require('../constellation-defaults/corruption')
    },
    "human-disease-disability": {
        title: "Human disease and disability",
        source: {
            name: "UIA",
            url: "http://encyclopedia.uia.org/"
        },
        options: require('../constellation-defaults/human-disease')
    }

}

app.get('/constellations/:name', (req, res) => {

    const constellation = constellations[req.params.name];

    if (!constellation)
        return res.render('not-found');

    res.render('constellation', {
        constellation: req.params.name,
        title: constellation.title,
        source: constellation.source,
        options: btoa(JSON.stringify(constellation.options))

    });
});