const dbSession = utilities.dependencyLocator.get('dbSession');

const getNodeEdgesById = async (id) => {

    const response = await dbSession.run('MATCH (nodeA)-[edge]-(nodeB) WHERE id(nodeA) = $id RETURN edge, nodeA, nodeB', {id: parseInt(id)});

    const edges = [];
    response.records.forEach(r => {

        const record = r.toObject();

        const edgeObj = record.edge;
        const fromObj = edgeObj.start.toNumber() === record.nodeA.identity.toNumber() ? record.nodeA : record.nodeB;
        const toObj = edgeObj.end.toNumber() === record.nodeA.identity.toNumber() ? record.nodeA : record.nodeB;


        edges.push({
            from: {
                id: fromObj.identity.toNumber(),
                name: fromObj.properties.name
            },
            to: {
                id: toObj.identity.toNumber(),
                name: toObj.properties.name
            },
            type: edgeObj.type
        });

    });

    return edges;
}

utilities.dependencyLocator.register('getNodeEdgesById', getNodeEdgesById);