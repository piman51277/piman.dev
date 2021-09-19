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

app.listen(3000)

