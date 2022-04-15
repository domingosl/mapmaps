require('dotenv').config({path: `${__dirname}/../.env`});

const dbSession = require('../api/services/db-conn');
//const dbSession = { run: (txt) => console.log(txt)};

const formatText = (obj)=> JSON.stringify(obj).replace(/"([^"]+)":/g, '$1:');

const constellation = 'longevity';

const data = {"nodes":[
        {"id":677,"label":"Isolated Default","color":"#00d500","value":1,"type":1},
        {"id":678,"label":"Epigenetics","color":"#00d500","value":1,"type":1},
        {"id":679,"label":"Telomere control","color":"#00d500","value":1,"type":1},
        {"id":680,"label":"Senescent cell control","color":"#00d500","value":1,"type":1},
        {"id":682,"label":"Stem cell niche","color":"#00d500","value":2,"type":1},
        {"id":685,"label":"Electrodynamics","color":"#00d500","value":1,"type":1},
        {"id":686,"label":"Gene expression control","color":"#00d500","value":1,"type":1},
        {"id":687,"label":"Circadian rhythm control","color":"#00d500","value":1,"type":1},
        {"id":688,"label":"Cellular reprogramming","color":"#00d500","value":1,"type":1},
        {"id":689,"label":"Inflammation","color":"#00d500","value":1,"type":1},
        {"id":690,"label":"Cure for cancer","color":"#00d500","value":1,"type":1},
        {"id":691,"label":"Cell therapy","color":"#00d500","value":1,"type":1},
        {"id":692,"label":"Microbiome control","color":"#00d500","value":1,"type":1},
        {"id":693,"label":"ECM reconstruction","color":"#00d500","value":0,"type":1},
        {"id":694,"label":"Immunosenescence","color":"#00d500","value":1,"type":1},
        {"id":695,"label":"Progressive brain replacement","color":"#00d500","value":2,"type":1},
        {"id":696,"label":"Organ transplants","color":"#00d500","value":0,"type":1},
        {"id":697,"label":"Brain transplant","color":"#00d500","value":1,"type":1},
        {"id":698,"label":"Head transplant","color":"#00d500","value":3,"type":1},
        {"id":699,"label":"Body replacement","color":"#00d500","value":1,"type":1}],
    "edges":[
        {"id":152,"from":678,"to":686,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":164,"from":678,"to":689,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":140,"from":678,"to":680,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":157,"from":680,"to":690,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":155,"from":682,"to":688,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":154,"from":682,"to":691,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":840,"from":686,"to":687,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":139,"from":686,"to":689,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":153,"from":685,"to":693,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":142,"from":685,"to":686,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":141,"from":692,"to":689,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":156,"from":695,"to":699,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":143,"from":698,"to":699,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":158,"from":696,"to":699,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":144,"from":697,"to":699,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}},
        {"id":147,"from":691,"to":694,"label":"IMPLIES_THAT","arrows":"to","color":"rgba(255,255,255, .35)","shadow":{"color":"rgba(0,0,0, .35)"}}]};



(async ()=>{

    for(const node of data.nodes) {

        const problem = { name: node.label, constellation };
        await dbSession.run('CREATE (:PROBLEM ' + formatText(problem) + ')');

    }

    for(const edge of data.edges) {

        let p1 = data.nodes.find(node => node.id === edge.from);
        p1 = { name: p1.label, constellation };

        let p2 = data.nodes.find(node => node.id === edge.to);
        p2 = { name: p2.label, constellation };

        await dbSession.run('MATCH (p1:PROBLEM ' + formatText(p1) + '), (p2:PROBLEM ' + formatText(p2) + ') CREATE (p1)-[:' + edge.label + ']->(p2)');

    }

})()


