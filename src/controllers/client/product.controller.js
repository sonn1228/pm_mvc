import productHelper from '../../helpers/product.helper.js';
import productsCategoryHelper from '../../helpers/products-category.js';
import Product from '../../models/product.model.js';
import ProductCategory from '../../models/productCategory.model.js';
class ProductController {

  // [GET] /products

  index = async (req, res) => {
    // find
    const find = {
      status: 'active',
      deleted: false,
    };

    // sort
    const sort = {
      position: 'desc',
    };

    const products = await Product.find(find).sort(sort);
    const newProducts = productHelper.priceNewProducts(products);

    res.render('client/pages/products/index.pug', {
      pageTitle: 'Product client',
      products: newProducts,
    });
  };

  // [GET] /products/detail/:slug
  detail = async (req, res) => {
    try {
      const slug = req.params.slugProduct;

      const find = {
        slug: slug,
        status: 'active',
        deleted: false,
      };

      const product = await Product.findOne(find);
      productHelper.priceNewProduct(product);

      if (product.product_category_id) {
        const productsCategory = await ProductCategory.findOne({
          _id: product.product_category_id,
        });
        product.category = productsCategory;
      }

      res.render('client/pages/products/detail.pug', {
        product: product,
      });
    } catch (error) {
      res.json(error);
    }
  };

  // [GET] /products/:slugCategory
  category = async (req, res) => {
    try {
      const slug = req.params.slugCategory;
      const category = await ProductCategory.findOne({
        deleted: false,
        slug: slug,
        status: 'active',
      });

      const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);
      const listIdSubCategory = listSubCategory.map((item) => item.id);

      const products = await Product.find({
        product_category_id: { $in: [category._id, ...listIdSubCategory] },
        deleted: false,
        status: 'active',
      }).sort({
        position: 'desc',
      });

      const newProducts = productHelper.priceNewProducts(products);
      res.render('client/pages/products/index.pug', {
        pageTitle: category.title,
        products: newProducts,
      });
    } catch (error) {
      req.flash('error', 'Page Not Found!');
      res.redirect('/products');
    }
  };

}
export default new ProductController();
