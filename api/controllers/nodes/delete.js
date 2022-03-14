const dbSession = utilities.dependencyLocator.get('dbSession');

const allowOnlySandboxChanges = require('../../middlewares/allow-only-sandbox-changes');

new utilities.express
    .Service('deleteNode')
    .isDelete()
    .setMiddlewares([allowOnlySandboxChanges])
    .respondsAt('/nodes/:id')
    .controller(async (req, res) => {

        await dbSession.run('MATCH (node) WHERE id(node) = $id AND node.constellation = $constellation DETACH DELETE node', {
            id: parseInt(req.params.id),
            constellation: req.query.constellation
        });

        res.resolve();

    });