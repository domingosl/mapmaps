module.exports = {
    autoResize: true,
    nodes: {
        shape: "dot",
        margin: 5,
        font: {
            color: '#ffffff',
            size: 15, // px
            face: 'Montserrat',
            //align: 'center'
        }
    },
    layout: {
        randomSeed: 123,
        hierarchical: {
            enabled: true,
            direction: "LR",
            levelSeparation: 300,
            //nodeSpacing: 500,
            //treeSpacing: 300
        },
    },
    physics: {
        enabled: true
    },
    edges: {
        width: 3,
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