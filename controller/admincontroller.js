const layout = "./admin/adminlayout";
var adminHelper = require("../Model/helpers/Adminhelpers");
const {
  adminLOgin,
  getAllUsers,
  blockUser,
  unblockUser,
  adminAddcat,
  getAllCategory,
  deleteCategorys,
  getCategory,
  editcategoryp,
  addproduct,
  getAllproducts,
  deleteProducts,
  getproducts,
  editproductPost,
  getOrders,
  getOrdersad,
  vieworderedproducts,
  statusPin,
  adminSalesGraph,
  downloadReport,
  CouponAd,
  getAllCoupons,
  deleteCoupons,
  TotalOrders,
} = adminHelper;

module.exports = {
  homePage: (req, res, next) => {
    try {
      res.render("admin/adsignin", { layout });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  adDash: (req, res, next) => {
    try {
      if (req.session.loggedInad) {
        adminSalesGraph().then((Data) => {
          res.render("admin/indexad", { layout, adin: true, Data });
        });
      } else {
        res.redirect("/admin");
      }
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  adsigninPost: (req, res, next) => {
    try {
      adminLOgin(req.body)
        .then((response) => {
          let admina = response.status;

          if (admina) {
            req.session.loggedInad = true;
            req.session.admin = response.validadmin;
            res.redirect("/admin/dashboard");
          } else {
            res.redirect("/admin");
          }
        })
        .catch((error) => {
          res.status(500).send(error.message);
        });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  viewUsers: (req, res, next) => {
    try {
      if (req.session.loggedInad) {
        getAllUsers()
          .then((users) => {
            res.render("admin/viewusers", { layout, adin: true, users });
          })
          .catch((error) => {
            res.status(500).send(error.message);
          });
      } else {
        res.redirect("/admin");
      }
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },

  blockUser: (req, res, next) => {
    try {
      if (req.session.loggedInad) {
        const userid = req.params.id;

        blockUser(userid)
          .then((response) => {
            res.redirect("/admin/viewusers");
          })
          .catch((error) => {
            res.status(500).send(error.message);
          });
      } else {
        res.redirect("/admin");
      }
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  unblockUser: (req, res, next) => {
    try {
      const userid = req.params.id;

      unblockUser(userid)
        .then((response) => {
          res.redirect("/admin/viewusers");
        })
        .catch((error) => {
          res.status(500).send(error.message);
        });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  category: (req, res, next) => {
    try {
      res.render("admin/add-category", { layout, adin: true });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  addCategory: (req, res, next) => {
    try {
      adminAddcat(req.body)
        .then((category) => {
          const oldcat = category.status;
          if (oldcat) {
            res.render("admin/view-category", {
              layout,
              olduser,
              adminin: true,
            });
          } else {
            res.redirect("/admin/view-category");
          }
        })
        .catch((error) => {
          res.status(500).send(error.message);
        });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  viewCategory: (req, res, next) => {
    try {
      getAllCategory().then((categories) => {
        res.render("admin/view-category", { layout, adin: true, categories });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  deleteCategory: (req, res, next) => {
    try {
      const userid = req.params.id;
      console.log(userid);

      deleteCategorys(userid).then((response) => {
        res.redirect("/admin/view-category");
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  editCategory: (req, res, next) => {
    const userid = req.params.id;
    try {
      getCategory(userid).then((category) => {
        res.render("admin/edit-category", { layout, adin: true, category });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  editcategoryPost: (req, res, next) => {
    try {
      editcategoryp(req.body).then((response) => {
        res.redirect("/admin/view-category");
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  addProduct: (req, res, next) => {
    try {
      getAllCategory().then((categories) => {
        res.render("admin/add-product", { layout, adin: true, categories });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  addproductPost: (req, res, next) => {
    try {
      const files = req.files;

      const filename = files.map((file) => {
        return file.filename;
      });
      const product = req.body;
      product.productImage = filename;

      addproduct(req.body).then((response) => {
        const files = req.files;
        let proImage = product.productImage;

        res.redirect("/admin/add-product");
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  viewProducts: (req, res, next) => {
    try {
      getAllproducts().then((products) => {
        res.render("admin/product-list", { layout, adin: true, products });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  deleteProduct: (req, res, next) => {
    try {
      const productid = req.params.id;

      deleteProducts(productid).then((response) => {
        res.redirect("/admin/view-products");
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  editProducts: (req, res, next) => {
    try {
      const productid = req.params.id;

      getproducts(productid).then((products) => {
        getAllCategory().then((categories) => {
          res.render("admin/edit-product", {
            layout,
            adin: true,
            products,
            categories,
          });
        });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  editProductpost: (req, res, next) => {
    try {
      let data = req.body;
      let images = req.files;

      editproductPost(data, images).then((response) => {
        res.redirect("/admin/view-products");
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  LogOut: (req, res, next) => {
    try {
      req.session.loggedInad = false;
      req.session.admin = null;
      //req.session.destroy();
      res.redirect("/admin");
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  viewOrders: async (req, res, next) => {
    try {
      let Pageno = req.query.page || 1;

      let pageNum = parseInt(Pageno);
      let orders = await getOrders();
      let TotalOrder = orders.length;
      let lmt = 8;
      let Pages = [];
      for (let i = 1; i <= Math.ceil(TotalOrder / lmt); i++) {
        Pages.push(i);
      }
      let Orders = await TotalOrders(pageNum, lmt);
      res.render("admin/orderlist", { layout, adin: true, Orders, Pages });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  orderDetail: async (req, res, next) => {
    try {
      let orders = await getOrdersad(req.params.id);
      let orderedproducts = await vieworderedproducts(req.params.id);
      res.render("admin/orderdetail", {
        layout,
        adin: true,
        orderedproducts,
        orders,
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  statusChange: (req, res, next) => {
    try {
      statusPin(req.body).then((response) => {
        res.json(response);
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  downloadReport: async (req, res, next) => {
    try {
      let Orders = await downloadReport();
      let Data = await adminSalesGraph();

      res.render("admin/sales-report", { layout, adin: true, Orders, Data });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  AddCoupon: (req, res, next) => {
    try {
      res.render("admin/coupon-manage", { layout, adin: true });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  addNewcpn: (req, res, next) => {
    try {
      CouponAd(req.body).then((response) => {
        res.render("admin/coupon-manage", { layout, adin: true, cpn: true });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  couponView: async (req, res, next) => {
    try {
      let Coupons = await getAllCoupons();

      res.render("admin/view-coupon", { layout, adin: true, Coupons });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
  DeleteCoupon: (req, res, next) => {
    try {
      const Id = req.body.coupon;

      deleteCoupons(Id).then((response) => {
        res.json(response);
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
        admin: true,
      });
    }
  },
};
