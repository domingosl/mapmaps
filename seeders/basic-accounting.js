require('dotenv').config({path: `${__dirname}/../.env`});

const GwApiV2 = require("gwapiv2-node-client");

(async ()=>{

    const gwApi = new GwApiV2(process.env.NODE_ENV, 'test', process.env.GW_BA_USER, process.env.GW_BA_PASSWORD);

    const owner = (await gwApi.Users.create({
        name: "Domingo",
        surname: "Lupo",
        email: "domingo.lupo-test-c@growishpay.com",
        birthDate: "01/01/1980"
    })).data;

    const wallet = (await gwApi.Wallets.create({
        owner: owner._id,
        currency: 'EUR'
    }));

    console.log({owner, wallet});

})()


