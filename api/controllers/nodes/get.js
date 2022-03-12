const dbSession = utilities.dependencyLocator.get('dbSession');
const getNodeEdgesById = utilities.dependencyLocator.get('getNodeEdgesById');

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


        res.resolve({
            id: nodeObj.node.identity.toNumber(),
            name: nodeObj.node.properties.name,
            content: nodeObj.node.properties.content || "{}",
            color: "#efb725",
            type: isProblem ? 0 : 1, //0: problem
            group: isProblem ? 0 : 1,
            edges: await getNodeEdgesById(req.params.id)
        });

    });