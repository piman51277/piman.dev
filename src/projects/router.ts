import express from 'express';
import { renderProject } from './render';
import { projectIndex } from './import';

//create routes for individual projects
const router = express.Router();

for (const project in projectIndex) {
	const config = projectIndex[project];

	router.get(`/${project}`, renderProject(project, config));
}

//create route for projects index

//change projectIndex to array form
const projects = Object.keys(projectIndex).sort((a, b) => {
	if (a < b) return -1;
	if (a > b) return 1;
	return 0;
}).map(project => {
	return { ...projectIndex[project], name: project };
});

//choose 6 projects to feature
const featured = new Array(6).fill({});

const selectionSet = projects.slice();
for(let i =0;i<6;i++){
	if(selectionSet.length === 0) break;
	const index = Math.floor(Math.random() * selectionSet.length);
	featured[i] = selectionSet[index];
	selectionSet.splice(index, 1);
}

router.get('/', (req, res) => {
	res.render('projectIndex', {
		layout: 'main',
		projects,
		featured
	});
});

//random project
router.get('/random', (req, res) => {
	const project = projects[Math.floor(Math.random() * projects.length)];
	res.redirect(`/projects/${project.name}`);
});

export default router;