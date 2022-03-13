const dbSession = utilities.dependencyLocator.get('dbSession');
const getNodeEdgesById = utilities.dependencyLocator.get('getNodeEdgesById');

new utilities.express
    .Service('saveNode')
    .isPost()
    .respondsAt('/nodes')
    .controller(async (req, res) => {

        const label = req.body.type === 0 ? 'PROBLEM' : 'SOLUTION';

        const response = await dbSession.run('CREATE (n:' + label + ' $data) RETURN n', {
            data: {
                name: req.body.name.toLowerCase(),
                content: req.body.content,
                constellation: req.body.constellation
            }
        });

        const newNodeId = response.records[0].toObject().n.identity.toNumber();


        for (let edge of req.body.edges) {

            await dbSession
                .run('MATCH (nodeA) MATCH(nodeB) WHERE id(nodeB) = $nodeBId AND id(nodeA) = $nodeAId MERGE(nodeA)-[:' + edge.type + ']->(nodeB)',
                    {
                        nodeAId: edge.from.id || newNodeId,
                        nodeBId: edge.to.id || newNodeId
                    });
        }


        res.resolve();

    });