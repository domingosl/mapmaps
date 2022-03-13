const dbSession = utilities.dependencyLocator.get('dbSession');
const getNodeEdgesById = utilities.dependencyLocator.get('getNodeEdgesById');

new utilities.express
    .Service('deleteNode')
    .isDelete()
    .respondsAt('/nodes/:id')
    .controller(async (req, res) => {

        await dbSession.run('MATCH (node) WHERE id(node) = $id DETACH DELETE node', {id: parseInt(req.params.id)});

        res.resolve();

    });