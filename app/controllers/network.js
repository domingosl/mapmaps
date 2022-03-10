const networks = {
    world: {
        title: "The world map of humanity problems",
        source: { name: null, url: null }
    },
    "human-stress": {
        title: "Stress disorders in human beings",
        source: {
            name: "UIA",
            url: "http://encyclopedia.uia.org/"
        },
        options: require('../network-defaults/stress-humans')
    }
}

app.get('/networks/:name', (req, res) => {

    const network = networks[req.params.name];

    if(!network)
        return res.render('not-found');

    res.render('network', {network: req.params.name, ...network});
});