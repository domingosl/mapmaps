const dbSession = utilities.dependencyLocator.get('dbSession');

new utilities.express
    .Service('getNode')
    .isGet()
    .respondsAt('/nodes/:id')
    .controller(async (req, res) => {

        let response = await dbSession.run('MATCH (n) WHERE id(n) = $id RETURN n LIMIT 1', { id: parseInt(req.params.id) });

        if(response.records.length === 0)
            return res.resolve();

        const obj = response.records[0].toObject();

            const isProblem = obj.n.labels.indexOf('PROBLEM') >= 0;

            res.resolve({
                id: obj.n.identity.toNumber(),
                name: obj.n.properties.name,
                content: obj.n.properties.content || "{}",
                color: "#efb725",
                type: isProblem ? 0 : 1, //0: problem
                group: isProblem ? 0 : 1
            });

    });