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
const projects = Object.keys(projectIndex).map(project => {
	return { ...projectIndex[project], name: project }
});

router.get('/', (req, res) => {
	res.render('projectIndex', {
		layout: 'main',
		projects
	})
})

export default router;