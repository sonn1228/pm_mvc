import Account from '../../models/account.model.js';
import Role from '../../models/role.model.js';

class RoleController {

  // [GET] /admin/roles
  index = async (req, res) => {
    const user = res.locals.user;
    const role = await Role.findOne({ _id: user.role_id });
    res.render('admin/pages/my-account/index.pug', { user, role });
  }

  // [GET] /admin/edit
  edit = async (req, res) => {
    res.render('admin/pages/my-account/edit.pug');
  }

  // [PATCH] /admin/editPatch
  editPatch = async (req, res) => {
    const id = res.locals.user.id;
    const existEmail = await Account.findOne({
      _id: { $ne: id },
      email: req.body.email,
      deleted: false
    });
    if (existEmail) {
      req.flash('error', "Email Existed");
      res.redirect('back');
      return;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash('success', "Update Successfully");
    res.redirect('back');
  }

}
export default new RoleController();