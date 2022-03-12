const dbSession = utilities.dependencyLocator.get('dbSession');

new utilities.express
    .Service('getGlobalMap')
    .isGet()
    .respondsAt('/constellations/:constellation')
    .controller(async (req, res) => {

        const nodes = [];
        const edges = [];

        let response = await dbSession.run('MATCH (problem:PROBLEM { constellation: $constellation }) RETURN problem, size((problem)-[]->()) as size', { constellation: req.params.constellation });

        //TODO: MANAGE SOLUTIONS TOO!

        (response.records.map(record => {
            const obj = record.toObject();

            nodes.push({
                id: obj.problem.identity.toNumber(),
                label: obj.problem.properties.name,
                color: "#efb725",
                value: obj.size.toNumber(),
                type: 0, //0: problem
                group: 0
            });

            return obj;
        }));


        response = await dbSession.run('MATCH (:PROBLEM { constellation: $constellation })-[edge]->(:PROBLEM { constellation: $constellation }) RETURN edge', { constellation: req.params.constellation });

        (response.records.map(record => {
            const obj = record.toObject().edge;

            edges.push({
                id: obj.identity.toNumber(),
                from: obj.start.toNumber(),
                to: obj.end.toNumber(),
                label: obj.type,
                arrows: 'to'
            });

            return obj;
        }));

        res.resolve({ nodes, edges });

    });