import express from 'express';
import controller from '../../controllers/admin/role.controller.js';

const router = express.Router();

router.get('/', controller.index);
// router.get('/create', controller.create);
// router.post('/create', controller.createPost);
// router.delete('/delete/:id', controller.delete);
// router.get('/permissions', controller.permissions);
// router.patch('/permissions', controller.permissionsPatch);

export default router;
