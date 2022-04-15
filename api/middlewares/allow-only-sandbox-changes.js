module.exports = (req, res, next) => {

    if(req.query.constellation && (req.query.constellation === 'world' || req.query.constellation === 'longevity'))
        return next();

    if(req.body.constellation === 'world')
        return next();

    return res.forbidden("Sorry, but modifications to featured constellations are not " +
        "allowed during the judging period. Please use the Sandbox for experimenting with Constellapedia");

}