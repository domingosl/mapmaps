const neo4j = require("neo4j-driver");
const getNodeEdgesById = utilities.dependencyLocator.get('getNodeEdgesById');

app.get('/nodes/:id', async (req, res) => {

    const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));
    const session = driver.session();

    const response = await session.run('MATCH (node) WHERE id(node) = $id RETURN node LIMIT 1', {id: parseInt(req.params.id)});

    if (response.records.length === 0)
        return res.resolve();


    const nodeObj = response.records[0].toObject();

    const isProblem = nodeObj.node.labels.indexOf('PROBLEM') >= 0;


    res.render('node', {
        nodeData: Buffer.from(JSON.stringify({
            id: nodeObj.node.identity.toNumber(),
            name: nodeObj.node.properties.name,
            constellation: nodeObj.node.properties.constellation,
            content: nodeObj.node.properties.content || "{}",
            type: isProblem ? 0 : 1, //0: problem
            edges: await getNodeEdgesById(parseInt(req.params.id))
        })).toString('base64')
    });
});