const dbSession = utilities.dependencyLocator.get('dbSession');

new utilities.express
    .Service('findNode')
    .isGet()
    .respondsAt('/nodes/search/:name')
    .controller(async (req, res) => {

        let response = await dbSession.run('MATCH (n) WHERE n.name CONTAINS $name RETURN n LIMIT 5', { name: req.params.name.toLowerCase() });

        const nodes = [];

        (response.records.map(record => {
            const obj = record.toObject();

            const isProblem = obj.n.labels.indexOf('PROBLEM') >= 0;

            nodes.push({
                id: obj.n.identity.toNumber(),
                label: obj.n.properties.name,
                color: "#efb725",
                type: isProblem ? 0 : 1, //0: problem
                group: isProblem ? 0 : 1
            });

        }));

        res.resolve(nodes);

    });