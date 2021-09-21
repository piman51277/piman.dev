import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
	res.render('home', {
		layout: 'home'
	});
});

export default router;