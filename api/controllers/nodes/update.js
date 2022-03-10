const dbSession = utilities.dependencyLocator.get('dbSession');

new utilities.express
    .Service('getNode')
    .isPut()
    .respondsAt('/nodes/:id')
    .controller(async (req, res) => {

        await dbSession.run('MATCH (n) WHERE id(n) = $id SET n.name = $name, n.content = $content RETURN n', {
            id: parseInt(req.params.id),
            name: req.body.name,
            content: req.body.content
        });

        res.resolve();

    });