require('dotenv').config();

const axios = require('axios');
const dbSession = require('./api/services/db-conn');

const formatText = (obj)=> JSON.stringify(obj).replace(/"([^"]+)":/g, '$1:');

const URL = 'http://encyclopedia.uia.org/sites/en.uia.org/visuals/json.php?docid=11316480&vol=problems&dataset=narrow';
const universe = 'human-stress';

(async ()=>{

    const data = (await axios.get(URL)).data;

    const genesisProblem = { name: data.name.toLowerCase(), universe };
    await dbSession.run('CREATE (:PROBLEM ' + formatText(genesisProblem) + ')');

    for(let c = 0; c < data.children.length; c++) {
        const child = data.children[c];

        const problem = { name: child.name.toLowerCase(), universe };

        console.log('CREATE (:PROBLEM ' + formatText(problem) + ')');

        await dbSession.run('CREATE (:PROBLEM ' + formatText(problem) + ')');
        await dbSession.run('MATCH (p1:PROBLEM ' + formatText(genesisProblem) + '), (p2:PROBLEM ' + formatText(problem) + ') CREATE (p1)-[:CAUSES]->(p2)');

        if(!child.children)
            continue;

        for(let cc = 0; cc < child.children.length; cc++) {

            const _child = child.children[cc];
            const childProblem = { name: _child.name.toLowerCase(), universe };

            console.log('CREATE (:PROBLEM ' + formatText(childProblem) + ')');
            await dbSession.run('CREATE (:PROBLEM ' + formatText(childProblem) + ')');
            await dbSession.run('MATCH (p1:PROBLEM ' +  formatText(problem) + '), (p2:PROBLEM ' + formatText(childProblem) + ') CREATE (p1)-[:CAUSES]->(p2)');


        }

    }

})();


//const dbSession = require('./db-conn');

//dbSession.run("CREATE (:PROBLEM {})")

//PROBLEM->CAUSES->PROBLEM
