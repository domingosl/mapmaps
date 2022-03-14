const dbSession = utilities.dependencyLocator.get('dbSession');
const allowOnlySandboxChanges = require('../../middlewares/allow-only-sandbox-changes');

new utilities.express
    .Service('updateNode')
    .isPut()
    .setMiddlewares([allowOnlySandboxChanges])
    .respondsAt('/nodes/:id')
    .controller(async (req, res) => {

        await dbSession.run('MATCH (n) WHERE id(n) = $id SET n.name = $name, n.content = $content RETURN n', {
            id: parseInt(req.params.id),
            name: req.body.name.toLowerCase(),
            content: req.body.content
        });

        //TODO: Need a less "aggressive" way of updating edges
        await dbSession.run('MATCH (node)-[r]-() WHERE id(node) = $id DELETE r', { id: parseInt(req.params.id) });

        for(let edge of req.body.edges) {

            await dbSession
                .run('MATCH (nodeA) MATCH(nodeB) WHERE id(nodeB) = $nodeBId AND id(nodeA) = $nodeAId MERGE(nodeA)-[:' + edge.type + ']->(nodeB)',
                    {
                        nodeAId: edge.from.id,
                        nodeBId: edge.to.id
                    });
        }


        res.resolve();

    });