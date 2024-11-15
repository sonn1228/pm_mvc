import Product from '../../models/product.model.js';
import productHelper from '../../helpers/product.helper.js';
class HomeController {

  index = async (req, res) => {
    const find = {
      deleted: false,
      featured: '1',
      status: 'active',
    };

    const productsFeatured = await Product.find(find);
    const newProductsFeatured = productHelper.priceNewProducts(productsFeatured);

    // New products
    const productsNew = await Product.find({
      status: 'active',
      deleted: false,
    }).limit(6).sort({
      position: 'desc',
    });

    const newProductsNew = productHelper.priceNewProducts(productsNew);

    res.render('client/pages/home/index.pug', {
      titlePage: 'Client Product',
      productsFeatured: newProductsFeatured,
      productsNew: newProductsNew,
    });
  };

}
export default new HomeController();
