module.exports = {
    autoResize: true,
    nodes: {
        shape: "dot",
        mass: 4,
        font: {
            color: '#ffffff',
            size: 25, // px
            face: 'Montserrat',
            //align: 'center'
        }
    },
    layout: {
        randomSeed: 123,
        hierarchical: {
            enabled: false,
            direction: "LR",
            levelSeparation: 300,
            //nodeSpacing: 500,
            //treeSpacing: 300
        },
    },
    physics: {
        enabled: true,
        forceAtlas2Based: {
            theta: 0.5,
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springConstant: 0.08,
            springLength: 100,
            damping: 1,
            avoidOverlap: 0
        },
        solver: 'forceAtlas2Based'
    },
    edges: {
        width: 3,
        physics: true,
        selectionWidth: 10,

        font: {
            color: '#aaa',
            strokeWidth: 0,
            size: 10, // px
            face: 'Montserrat',
            //align: 'center'
        }
    }
};