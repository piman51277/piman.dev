//dotenv
import dotenv from 'dotenv';
dotenv.config();

//server
import express from 'express';
import handlebars from 'express-handlebars';

const app = express();
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
    layoutsDir: './layouts',
    partialsDir: './partials'
}));

//public assets
app.use('/assets',express.static('public'));

//projects
import ProjectRouter from './projects/router';
app.use('/projects', ProjectRouter);
app.use('/assets/projects', express.static('projects'));

//homepage
import HomeRouter from './routes/home';
app.use('/', HomeRouter);

//https
import https from 'https';
import fs from 'fs';
const path = process.env.KEY_PATH || './cert';

const options = {
    key: fs.readFileSync(path + '/privkey.pem'),
    cert: fs.readFileSync(path + '/cert.pem'),
    ca: fs.readFileSync(path + '/chain.pem')
};

https.createServer(options, app).listen(process.env.HTTPS_PORT || 443);

//http
import http from 'http';

http.createServer(app).listen(process.env.HTTP_PORT || 80);