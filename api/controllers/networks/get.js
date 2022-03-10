const dbSession = utilities.dependencyLocator.get('dbSession');

new utilities.express
    .Service('getGlobalMap')
    .isGet()
    .respondsAt('/networks/:universe')
    .controller(async (req, res) => {

        const nodes = [];
        const edges = [];

        let response = await dbSession.run('MATCH (problem:PROBLEM { universe: $universe }) RETURN problem, size((problem)-[]->()) as size', { universe: req.params.universe });

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


        response = await dbSession.run('MATCH (:PROBLEM { universe: $universe })-[edge]->(:PROBLEM { universe: $universe }) RETURN edge', { universe: req.params.universe });

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