import express from 'express';
import {renderProject} from './render';
import { importProjects } from './import';

const projects = importProjects();

//create routes
const router = express.Router();

for(const project in projects) {
	const config = projects[project];

	router.get(`/${project}`, renderProject(project,config));
}

export default router;