import systemConfig from '../../config/system.js';
import Account from '../../models/account.model.js';
import Role from '../../models/role.model.js';
class AuthMiddleware {

  requireAuth = async (req, res, next) => {
    if (req.cookies.token) {
      const user = await Account.findOne({
        token: req.cookies.token
      }).select("-password");
      if (!user) {
        res.redirect(`${systemConfig.prefixAdmin}`);
        return;
      }
      const role = await Role.findOne({
        _id: user.role_id
      });

      res.locals.user = user;
      res.locals.role = role;
    }
    else {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
      return;
    }

    next();
  }
}
export default new AuthMiddleware();