require('dotenv').config({path: `${__dirname}/../.env`});

const axios = require('axios');
const dbSession = require('../api/services/db-conn');

const formatText = (obj)=> JSON.stringify(obj).replace(/"([^"]+)":/g, '$1:');

const URL = 'http://encyclopedia.uia.org/sites/en.uia.org/visuals/json.php?docid=11119860&vol=problems&dataset=narrow';
const constellation = 'corruption';

(async ()=>{

    const data = (await axios.get(URL)).data;

    const genesisProblem = { name: data.name.toLowerCase(), constellation };
    await dbSession.run('CREATE (:PROBLEM ' + formatText(genesisProblem) + ')');

    for(let c = 0; c < data.children.length; c++) {
        const child = data.children[c];

        const problem = { name: child.name.toLowerCase(), constellation };

        console.log('CREATE (:PROBLEM ' + formatText(problem) + ')');

        await dbSession.run('CREATE (:PROBLEM ' + formatText(problem) + ')');
        await dbSession.run('MATCH (p1:PROBLEM ' + formatText(genesisProblem) + '), (p2:PROBLEM ' + formatText(problem) + ') CREATE (p1)-[:CAN_CAUSE]->(p2)');

        if(!child.children)
            continue;

        for(let cc = 0; cc < child.children.length; cc++) {

            const _child = child.children[cc];
            const childProblem = { name: _child.name.toLowerCase(), constellation };

            console.log('CREATE (:PROBLEM ' + formatText(childProblem) + ')');
            await dbSession.run('CREATE (:PROBLEM ' + formatText(childProblem) + ')');
            await dbSession.run('MATCH (p1:PROBLEM ' +  formatText(problem) + '), (p2:PROBLEM ' + formatText(childProblem) + ') CREATE (p1)-[:CAN_CAUSE]->(p2)');


        }

    }

})();