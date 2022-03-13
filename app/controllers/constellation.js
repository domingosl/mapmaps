const constellations = {
    world: {
        title: "The world map of humanity problems",
        source: { name: null, url: null },
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

    if(!constellation)
        return res.render('not-found');

    res.render('constellation', {constellation: req.params.name, ...constellation});
});