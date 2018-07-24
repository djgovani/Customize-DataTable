const express = require('express');
const router = express.Router();

const employeesController = require('../controllers/employeesController');
const imageController = require('../controllers/imageController');


/* Default root page. */
router.get('/', (req, res) => {
  res.status(200).json({ statusCode: 200, message: 'OK' });
});

router.get(`/api/employees`, employeesController.getEmployees);
router.get(`/api/employees/:id`, employeesController.getSingleEmployee);
router.post(`/api/employees`, employeesController.postEmployees);
router.put(`/api/employees/:id`, employeesController.updateEmployees);
router.delete(`/api/employees/:id`, employeesController.deleteEmployee);

router.get(`/api/imgURL`, imageController.getImgUrl);
router.post('/api/upload', imageController.postImg);

module.exports = router;
