var userHelper = require("../Model/helpers/Userhelpers");

const paypal = require("paypal-rest-sdk");

const crypto = require("crypto");
const {
  getMenproduct,
  getWomenproducts,
  getcartCount,
  getAllproducts,
  addUserSignup,
  doUserLOgin,
  Dootplogin,
  viewproductUser,
  validOtp,
  addTocart,
  getTotal,
  changeProductquantity,
  cartView,
  removeProductcart,
  getproductList,
  orderPost,
  vieworders,
  vieworderedProducts,
  cancelOrderlist,
  otppassCheck,
  otpvc,
  retypePass,
  editAccount,
  accountEdit,
  addressSubmit,
  getUsers,
  allAddresses,
  chngeDefault,
  paymentStatusChange,
  TotalProductView,
  SrchPro,
  checkCoupon,
  returnOrder,
  generateRazorpay,
  verifyPaymentRazorpay,
  addtoWish,
  wishItemview,
  removeProductwish,
} = userHelper;
require("dotenv").config();

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.Client_id,
  client_secret: process.env.Client_secret,
});

module.exports = {
  homePage: async (req, res, next) => {
    try {
      const user = req.session.user;
      const menProducts = await getMenproduct();
      const womenProducts = await getWomenproducts();

      if (user) {
        let name = user.firstName;

        let cartCount = await getcartCount(user._id);

        getAllproducts().then((products) => {
          res.render("index", {
            user,
            products,
            cartCount,
            name,
            menProducts,
            womenProducts,
          });
        });
      } else {
        getAllproducts().then((products) => {
          res.render("index", { user, products, menProducts, womenProducts });
        });
      }
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },

  signIn: (req, res, next) => {
    try {
      if (req.session.loggedIn) {
        res.redirect("/");
      } else {
        res.render("users/signin", { user: false, users: true });
      }
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  signUp: (req, res, next) => {
    try {
      if (req.session.loggedIn) {
        res.redirect("/");
      } else {
        res.render("users/signup", { users: true });
      }
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  signupPost: (req, res, next) => {
    try {
      addUserSignup(req.body).then((user) => {
        const olduser = user.status;
        if (olduser) {
          res.render("users/signup");
        } else {
          res.render("users/signin", { nouser: true });
        }
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  signinPost: (req, res, next) => {
    try {
      doUserLOgin(req.body).then((response) => {
        if (response.status) {
          req.session.loggedIn = true;
          req.session.user = response.validuser;
          res.redirect("/");
        } else {
          res.render("users/signin", { nouser: true, user: false });
        }
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  logoutUser: (req, res, next) => {
    try {
      req.session.loggedIn = false;
      req.session.user = null;

      res.redirect("/login");
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  otpLogin: (req, res, next) => {
    res.render("users/otpsign", { user: false });
  },
  otpPost: (req, res, next) => {
    try {
      Dootplogin(req.body).then((response) => {
        if (response.status) {
          req.session.user = response.user;
          req.session.contactNo = req.body.contactNo;

          res.render("users/otp-login", { user: false });
        } else {
          res.render("users/otpsign", { user: false, novalidotp: true });
        }
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  otpValid: (req, res, next) => {
    try {
      res.render("users/otp-login", { user: false });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  validateOtp: (req, res, next) => {
    try {
      let contactNo = req.session.contactNo;

      validOtp(req.body, contactNo).then((response) => {
        if (response.valid) {
          req.session.loggedIn = true;
          res.redirect("/");
        } else {
          res.render("users/otp-login", { user: false, novalidotp: true });
        }
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },

  productPage: async (req, res, next) => {
    try {
      const productid = req.params.id;
      const userId = req.session.user._id;

      const name = req.session.user.firstName;
      let cartCount = await getcartCount(userId);
      viewproductUser(productid).then((products) => {
        res.render("users/productview", {
          user: true,
          login: true,
          products,
          cartCount,
          name,
        });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },

  addCart: async (req, res, next) => {
    try {
      const productid = req.params.id;

      const userid = req.session.user._id;

      addTocart(productid, userid).then((response) => {
        res.json(response);
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },

  cart: async (req, res, next) => {
    try {
      const name = req.session.user.firstName;

      const Total = await getTotal(req.session.user._id);

      const cartCount = await getcartCount(req.session.user._id);

      cartView(req.session.user._id).then((cartItems) => {
        req.session.cartItems = cartItems;

        res.render("users/cart", {
          user: true,
          login: true,
          cartItems,
          cartCount,
          name,
          Total,
        });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  changeQuantity: (req, res, next) => {
    try {
      changeProductquantity(req.body).then((response) => {
        res.json(response);
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  removeProduct: (req, res, next) => {
    try {
      removeProductcart(req.body).then((response) => {
        res.json(response);
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  orderProduct: async (req, res, next) => {
    try {
      const Total = await getTotal(req.session.user._id);
      const user = await getUsers(req.session.user._id);

      cartView(req.session.user._id).then((cartItems) => {
        res.render("users/orderpay", { cartItems, Total, user });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  placeorderPost: async (req, res, next) => {
    let user = req.session.user;

    let product = await getproductList(user._id);
    var totalamount = await getTotal(user._id);

    orderPost(req.body, user._id, product, totalamount[0].total).then(
      (response) => {
        let orderId = response.insertedId;
        req.session.orderID = orderId;
        req.session.totalamount = response.Amount;

        if (req.body.paymentmethod == "cod") {
          res.render("users/ordersucess", { user: true });
        } else if (req.body.paymentmethod == "paypal") {
          const create_payment_json = {
            intent: "sale",
            payer: {
              payment_method: "paypal",
            },
            redirect_urls: {
              return_url: "https://betterbuy.cloud/ordersuccess",
              cancel_url: "https://betterbuy.cloud/cancel",
            },
            transactions: [
              {
                item_list: {
                  items: [
                    {
                      name: "Redhock Bar Soap",
                      sku: "001",
                      price: req.session.totalamount,
                      currency: "USD",
                      quantity: 1,
                    },
                  ],
                },
                amount: {
                  currency: "USD",
                  total: req.session.totalamount,
                },
                description: "Molla Fashion Store",
              },
            ],
          };
          paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
              throw error;
            } else {
              for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                  res.redirect(payment.links[i].href);
                }
              }
            }
          });
        } else if (req.body.paymentmethod == "razorpay") {
          generateRazorpay(orderId, req.session.totalamount).then((order) => {
            res.render("users/RazorPay", { order });
          });
        } else {
          res.redirect("/order-payment");
        }
      }
    );
  },

  paypalSucces: (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    let totalamount = req.session.totalamount;
    let orderID = req.session.orderID;

    user = req.session.user;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: totalamount,
          },
        },
      ],
    };
    // Obtains the transaction details from paypal
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        //When error occurs when due to non-existent transaction, throw an error else log the transaction details in the console then send a Success string reposponse to the user.
        if (error) {
          throw error;
        } else {
          paymentStatusChange(orderID).then((response) => {
            res.render("users/ordersucess");
            req.session.orderID = null;
          });
        }
      }
    );
  },

  successPage: (req, res, next) => {
    try {
      res.render("users/ordersucess");
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  ordersList: async (req, res, next) => {
    try {
      const name = req.session.user.firstName;
      userid = req.session.user._id;

      let orders = await vieworders(userid);

      res.render("users/orderlist", { orders, user: true, name });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  vieworderProducts: async (req, res, next) => {
    try {
      let orderedproducts = await vieworderedProducts(req.params.id);
      const name = req.session.user.firstName;

      const date1 = new Date();
      const date2 = new Date(orderedproducts[0].DeliveredDate);
      const diffTime = Math.abs(date1 - date2);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      res.render("users/orderdetails", {
        orderedproducts,
        diffDays,
        user: true,
        name,
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  cancelOrder: (req, res, next) => {
    try {
      cancelOrderlist(req.body).then((response) => {
        res.json(response);
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  otpLoginps: (req, res, next) => {
    try {
      res.render("users/otploginpass", { user: false });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  otpPass: (req, res, next) => {
    try {
      otppassCheck(req.body).then((response) => {
        if (response.status) {
          req.session.user = response.user;
          req.session.contactNo = req.body.contactNo;

          res.render("users/otpvalidpass", { user: false });
        } else {
          res.render("users/otploginpass", { user: false, novalidotp: true });
        }
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  otPv: (req, res, next) => {
    try {
      res.render("users/otpvalidpass", { user: false });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  vlidChck: (req, res, next) => {
    try {
      let contactNo = req.session.contactNo;
      otpvc(req.body, contactNo).then((response) => {
        if (response.valid) {
          res.render("users/forgotpass", { user: false });
        } else {
          res.render("users/otp-login", { user: false, novalidotp: true });
        }
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  passChck: (req, res, next) => {
    try {
      res.render("users/forgotpass");
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  checkPass: (req, res, next) => {
    try {
      let contactNoo = req.session.contactNo;
      retypePass(req.body, contactNoo).then((response) => {
        res.render("users/forgotpass", { user: false, passchange: true });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  viewAccount: async (req, res, next) => {
    try {
      let userId = req.session.user._id;

      let usersPro = await userHelper.editAccount(userId);

      res.render("users/myaccount", { user: true, usersPro });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  viewAllproducts: async (req, res, next) => {
    try {
      const name = req.session.user.firstName;
      let Pageno = req.query.page || 1;

      let pageNum = parseInt(Pageno);

      let products = await getAllproducts();
      let TotalProducts = products.length;

      let lmt = 8;
      let Pages = [];
      for (let i = 1; i <= Math.ceil(TotalProducts / lmt); i++) {
        Pages.push(i);
      }

      let Products = await TotalProductView(pageNum, lmt);
      res.render("users/allproducts", { Products, Pages, name });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  accountPost: async (req, res, next) => {
    try {
      const name = req.session.user.firstName;
      const userId = req.body._id;

      let usersPro = await editAccount(userId);
      accountEdit(req.body, userId).then((response) => {
        if (response.status) {
          res.render("users/myaccount", {
            usersPro,
            user: true,
            name,
            save: true,
          });
        } else {
          res.render("users/myaccount", {
            usersPro,
            user: true,
            name,
            errorMsg: true,
          });
        }
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  //  viewAddress:(req,res,next)=>
  //  {
  //   try{
  //    res.render('users/selectAdresses',{user:true})
  //   }
  //   catch(error)
  //   {
  //       res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
  //   }

  //},
  addressAdd: (req, res, next) => {
    try {
      const name = req.session.user.firstName;
      res.render("users/addAddress", { user: true, name });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  newAddaddr: (req, res, next) => {
    try {
      let userId = req.session.user._id;

      addressSubmit(req.body, userId).then((response) => {
        res.json({ status: true });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  addressChange: async (req, res, next) => {
    try {
      const name = req.session.user.firstName;
      let userId = req.session.user._id;
      let Address = await allAddresses(userId);

      res.render("users/selectAdresses", { user: true, Address, name });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  changeDefault: (req, res, next) => {
    try {
      let userId = req.session.user._id;

      let adId = req.params.id;

      chngeDefault(adId, userId).then((response) => {
        res.json({ status: true });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  SearchData: (req, res, next) => {
    try {
      const name = req.session.user.firstName;
      let data = req.query.search;
      SrchPro(data)
        .then((SrchItem) => {
          res.render("users/searchproductlist", { user: true, name, SrchItem });
        })
        .catch(() => {
          res.render("searchnot");
        });
      // const Pro=SearchProduct(req.bod)
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  couponAdd: async (req, res, next) => {
    try {
      let Coupon = req.body;
      console.log(req.body);

      let Total = await getTotal(req.session.user._id);

      checkCoupon(Coupon, Total[0].total).then((response) => {
        res.json(response);
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  returnProducts: (req, res, next) => {
    let ID = req.params.id;
    returnOrder(ID).then((response) => {
      res.redirect("/orderlist");
    });
  },
  verifyRazorpay: async (req, res) => {
    try {
      let orderid = req.body["order[orderid]"];
      req.session.orderID = orderid;

      let signature = req.body["payment[razorpay_signature]"];
      signature.trim();
      let hmac = crypto.createHmac("sha256", process.env.KeySecret);
      hmac.update(
        req.body["payment[razorpay_order_id]"] +
          "|" +
          req.body["payment[razorpay_payment_id]"],
        process.env.KeySecret
      );
      hmac = hmac.digest("hex");
      hmac.trim();

      if (signature == hmac) {
        verifyPaymentRazorpay(orderid).then((response) => {
          res.json({ status: true });
        });
      } else {
        res.json({ status: false });
      }
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },

  WishlistView: async (req, res, next) => {
    try {
      const name = req.session.user.firstName;
      let cartCount = await getcartCount(req.session.user._id);
      wishItemview(req.session.user._id).then((wishList) => {
        res.render("users/wishlist", { user: true, name, wishList, cartCount });
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  addWish: (req, res, next) => {
    try {
      let productid = req.body.ProductId;

      let userid = req.session.user._id;

      addtoWish(productid, userid).then((response) => {
        res.json(response);
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
  removeWish: (req, res, next) => {
    try {
      removeProductwish(req.body).then((response) => {
        res.json(response);
      });
    } catch (error) {
      res.render("error", {
        message: error.message,
        code: 500,
        layout: "error-layout",
      });
    }
  },
};
