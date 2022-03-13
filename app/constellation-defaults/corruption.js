module.exports = {
    autoResize: true,
    nodes: {
        shape: "dot",
        mass: 17,
        font: {
            color: '#ffffff',
            size: 20, // px
            face: 'Montserrat'
        }
    },
    layout: {
        randomSeed: 123,
        hierarchical: {
            enabled: false,
            direction: "LR",
            levelSeparation: 300,
        },
    },
    physics: {
        enabled: true,
        forceAtlas2Based: {
            theta: 0.1,
            gravitationalConstant: -20,
            centralGravity: 0.01,
            springConstant: 0.08,
            springLength: 100,
            damping: 20,
            avoidOverlap: 0
        },
        solver: 'forceAtlas2Based'
    },
    edges: {
        width: 3,
        selectionWidth: 10,
        smooth: {
            type: "continuous",
        },
        font: {
            color: '#aaa',
            strokeWidth: 0,
            size: 15, // px
            face: 'Montserrat',
            //align: 'center'
        }
    }
};