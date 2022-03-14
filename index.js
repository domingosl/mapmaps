require('dotenv').config();

const tagLabel = 'APIEntryPoint';
const GwApiV2 = require("gwapiv2-node-client");

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const glob = require('glob');
const path = require("path");

const api = express();
const app = express();
const site = express();

global.gwApi = new GwApiV2(process.env.NODE_ENV, 'test', process.env.GW_BA_USER, process.env.GW_BA_PASSWORD);

api.use(bodyParser.json({limit: '1mb'}));
api.use(cors());
api.options('*', cors());

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'html');
app.engine('html',require('ejs').renderFile);

app.use(express.static('public'));
site.use(express.static('site'));

global.utilities = require('@growishpay/service-utilities');
global.app = app;

utilities.express.init(api);

//Loads plugins, services, models and controllers
const patterns = [
    "api/services/*.js",
    "api/controllers/**/*.js"
];

for(const pattern of patterns) {
    const files = glob.sync(pattern,null);

    for (const filePath of files) {
        require("./" + filePath);
    }
}

api.use('*', (req, res) => res.notFound());


api.listen(process.env.API_PORT, async () => {
    await gwApi.Domain.read();
    utilities.logger.info("Connection with GrowishPay API v2 OK", {tagLabel});

    utilities.logger.info("API Server ready!", {tagLabel, port: process.env.API_PORT});
});

app.get('/', (req, res)=>{
    res.render('index', {});
});

require('./app/controllers/constellation');

app.listen(process.env.APP_PORT, () => {
    utilities.logger.info("APP Server ready!", {tagLabel, port: process.env.APP_PORT});
});

site.listen(process.env.SITE_PORT, () => {
    utilities.logger.info("SITE Server ready!", {tagLabel, port: process.env.SITE_PORT});
});

//constellapedia.com
//app.constellapedia.com
//api.constellapedia.com