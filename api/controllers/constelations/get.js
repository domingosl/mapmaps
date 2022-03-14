const dbSession = utilities.dependencyLocator.get('dbSession');

new utilities.express
    .Service('getGlobalMap')
    .isGet()
    .respondsAt('/constellations/:constellation')
    .controller(async (req, res) => {

        const nodes = [];
        const edges = [];

        let response = await dbSession.run('MATCH (n { constellation: $constellation }) RETURN n, size((n)-[]->()) as size', { constellation: req.params.constellation });

        (response.records.map(record => {
            const obj = record.toObject();

            const isProblem = obj.n.labels.indexOf('PROBLEM') >= 0;

            nodes.push({
                id: obj.n.identity.toNumber(),
                label: obj.n.properties.name,
                color: isProblem ? "#efb725" : "#00d500",
                value: obj.size.toNumber(),
                type: isProblem ? 0 : 1,
                //group: isProblem ? 0 : 1
            });

            return obj;
        }));


        response = await dbSession.run('MATCH (n { constellation: $constellation })-[edge]->(nn { constellation: $constellation }) RETURN edge', { constellation: req.params.constellation });

        (response.records.map(record => {
            const obj = record.toObject().edge;

            edges.push({
                id: obj.identity.toNumber(),
                from: obj.start.toNumber(),
                to: obj.end.toNumber(),
                label: obj.type,
                arrows: 'to',
                color: 'rgba(255,255,255, .35)',
                shadow: {
                    color: 'rgba(0,0,0, .35)'
                }
            });

            return obj;
        }));

        if(req.query.download && req.query.download === 'json')
        {
            res.setHeader('Content-disposition', 'attachment; filename= constellation.json');
            res.setHeader('Content-type', 'application/json');
            res.send( JSON.stringify({ nodes, edges }) );
        }
        else
            res.resolve({ nodes, edges });

    });