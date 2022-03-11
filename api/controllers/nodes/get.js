const dbSession = utilities.dependencyLocator.get('dbSession');

new utilities.express
    .Service('getNode')
    .isGet()
    .respondsAt('/nodes/:id')
    .controller(async (req, res) => {

        let response = await dbSession.run('MATCH (node) WHERE id(node) = $id RETURN node LIMIT 1', {id: parseInt(req.params.id)});

        if (response.records.length === 0)
            return res.resolve();


        const nodeObj = response.records[0].toObject();

        const isProblem = nodeObj.node.labels.indexOf('PROBLEM') >= 0;


        response = await dbSession.run('MATCH (node)-[edge]-() WHERE id(node) = $id RETURN edge', {id: parseInt(req.params.id)});

        const edges = [];
        response.records.forEach(r => {

            const edgeObj = r.toObject().edge;

            edges.push({
                from: edgeObj.start.toNumber(),
                to: edgeObj.end.toNumber(),
                type: edgeObj.type
            });

        })

        res.resolve({
            id: nodeObj.node.identity.toNumber(),
            name: nodeObj.node.properties.name,
            content: nodeObj.node.properties.content || "{}",
            color: "#efb725",
            type: isProblem ? 0 : 1, //0: problem
            group: isProblem ? 0 : 1,
            edges
        });

    });