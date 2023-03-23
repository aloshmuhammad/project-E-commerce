var db = require("../connection");
var collection = require("../collections");
const bcrypt = require("bcrypt");

const { response } = require("../../app");
var moment = require("moment"); // require
var objectId = require("mongodb").ObjectId;
const Razorpay = require("razorpay");
require("dotenv").config();
const verifySid = "VA64162928165b69fa61d327c24f6f5fe7 ";
var instance = new Razorpay({
  key_id: process.env.KeyId,
  key_secret: process.env.KeySecret,
});
const client = require("twilio")(process.env.AccountSid, process.env.AuthToken);

module.exports = {
  doUserLOgin: (user) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let validuser = await db
        .get()
        .collection(collection.USERCOLLECTION)
        .findOne({ email: user.email });

      if (validuser) {
        bcrypt.compare(user.password, validuser.password).then((status) => {
          if (status) {
            if (validuser.status) {
              response.validuser = validuser;
              response.status = true;
              resolve(response);
            } else {
              response.status = false;
              resolve(response);
            }
          } else {
            response.status = false;
            resolve(response);
          }
        });
      }
    });
  },

  addUserSignup: (user) => {
    return new Promise(async (resolve, reject) => {
      let userold = {};
      let olduser = await db
        .get()
        .collection(collection.USERCOLLECTION)
        .findOne({ email: user.email });
      if (olduser) {
        userold.status = true;

        resolve(userold);
      } else user.status = true;
      user.password = await bcrypt.hash(user.password, 10);
      user.Address = [];
      db.get().collection(collection.USERCOLLECTION).insertOne(user);
      resolve({ status: false });

      resolve(user);
    });
  },
  getUSer: (Id) => {
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collection.USERCOLLECTION)
        .findOne({ _id: objectId(Id) });
      resolve(user);
    });
  },
  Dootplogin: (data) => {
    let mob = data.contactNo;

    return new Promise(async (resolve, reject) => {
      let validNo = await db
        .get()
        .collection(collection.USERCOLLECTION)
        .findOne({ contactNo: data.contactNo });
      if (validNo) {
        client.verify
          .services(verifySid)
          .verifications.create({ to: `+91${data.contactNo}`, channel: "sms" })
          .then((response) => {
            response.status = true;
            response.user = validNo;
            resolve(response);
          });
      } else {
        resolve({ status: false });
      }
    });
  },
  validOtp: (data, contactNo) => {
    const otp = data.otp;
    return new Promise(async (resolve, reject) => {
      await client.verify
        .services(verifySid)
        .verificationChecks.create({ to: `+91${contactNo}`, code: otp })
        .then((verification_check) => {
          resolve(verification_check);
        });
    });
  },

  otpvc: (data, contactNo) => {
    const otp = data.otp;
    return new Promise(async (resolve, reject) => {
      await client.verify
        .services(verifySid)
        .verificationChecks.create({ to: `+91${contactNo}`, code: otp })
        .then((verification_check) => {
          resolve(verification_check);
        });
    });
  },
  getAllproducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find()
        .toArray();

      resolve(products);
    });
  },
  viewproductUser: (productid) => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .findOne({ _id: objectId(productid) });

      resolve(products);
    });
  },
  addTocart: (productid, userid) => {
    let proObj = {
      item: objectId(productid),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collection.CARTCOLLECTION)
        .findOne({ user: objectId(userid) });
      if (userCart) {
        let proExist = userCart.product.findIndex(
          (product) => product.item == productid
        );

        if (proExist != -1) {
          db.get()
            .collection(collection.CARTCOLLECTION)
            .updateOne(
              { user: objectId(userid), "product.item": objectId(productid) },
              {
                $inc: { "product.$.quantity": 1 },
              }
            )
            .then((response) => {
              resolve({ status: false });
            });
        } else {
          await db
            .get()
            .collection(collection.CARTCOLLECTION)
            .updateOne(
              { user: objectId(userid) },
              {
                $push: { product: proObj },
              }
            )
            .then((response) => {
              resolve({ status: true });
            });
        }
      } else {
        let cartObj = {
          user: objectId(userid),
          product: [proObj],
        };
        await db
          .get()
          .collection(collection.CARTCOLLECTION)
          .insertOne(cartObj)
          .then((response) => {
            resolve({ status: true });
          });
      }
    });
  },
  cartView: (userid) => {
    return new Promise(async (resolve, reject) => {
      let cartItems = await db
        .get()
        .collection(collection.CARTCOLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userid) },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.item",
              quantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCTCOLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: 1,
              total: {
                $sum: {
                  $multiply: [
                    { $toDouble: "$quantity" },
                    { $toDouble: "$product.price" },
                  ],
                },
              },
            },
          },
        ])
        .toArray();

      resolve(cartItems);
    });
  },
  getcartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await db
        .get()
        .collection(collection.CARTCOLLECTION)
        .findOne({ user: objectId(userId) });
      if (cart) {
        count = count + cart.product.length;
      }
      resolve(count);
    });
  },
  changeProductquantity: (data) => {
    let quantity = parseInt(data.quantity);
    let count = parseInt(data.count);
    return new Promise(async (resolve, reject) => {
      if (data.count == -1 && data.quantity == 1) {
        await db
          .get()
          .collection(collection.CARTCOLLECTION)
          .updateOne(
            { _id: objectId(data.cart) },
            {
              $pull: { product: { item: objectId(data.product) } },
            }
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      } else {
        await db
          .get()
          .collection(collection.CARTCOLLECTION)
          .updateOne(
            {
              _id: objectId(data.cart),
              "product.item": objectId(data.product),
            },
            {
              $inc: { "product.$.quantity": count },
            }
          )
          .then((response) => {
            resolve(true);
          });
      }
    });
  },
  removeProductcart: (data) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.CARTCOLLECTION)
        .updateOne(
          { _id: objectId(data.cart) },
          {
            $pull: { product: { item: objectId(data.product) } },
          }
        )
        .then((response) => {
          resolve({ removeItem: true });
        });
    });
  },
  getTotal: (userid) => {
    return new Promise(async (resolve, reject) => {
      let Total = await db
        .get()
        .collection(collection.CARTCOLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userid) },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.item",
              quantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCTCOLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $multiply: [
                    { $toDouble: "$quantity" },
                    { $toDouble: "$product.price" },
                  ],
                },
              },
            },
          },
        ])
        .toArray();

      resolve(Total);
    });
  },
  orderPost: (order, userId, product, total) => {
    return new Promise(async (resolve, reject) => {
      let status = order.paymentmethod == "cod" ? "placed" : "pending";
      let orderObj = {
        deliveryDetails: {
          mobile: order.phoneno,
          address: order.address,
          pincode: order.pincode,
          firstname: order.firstname,
          lastname: order.lastname,
        },
        paymentmethod: order.paymentmethod,

        userId: objectId(userId),
        products: product,
        totalAmount: parseInt(order.totalPrice),
        status: status,
        date: moment().format("MMMM Do YYYY, h:mm:ss a"),
      };

      await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .insertOne(orderObj)
        .then((response) => {
          db.get()
            .collection(collection.CARTCOLLECTION)
            .deleteOne({ user: objectId(userId) });
          response.Amount = orderObj.totalAmount;
          console.log(response, "bug");
          resolve(response);
        });
    });
  },
  getproductList: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collection.CARTCOLLECTION)
        .findOne({ user: objectId(userId) });

      resolve(cart.product);
    });
  },
  vieworders: (userid) => {
    return new Promise(async (resolve, reject) => {
      let order = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .find({ userId: objectId(userid) })
        .sort({ date: -1 })
        .toArray();

      resolve(order);
    });
  },
  vieworderedProducts: (orderid) => {
    return new Promise(async (resolve, reject) => {
      let orderItems = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .aggregate([
          {
            $match: { _id: objectId(orderid) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
              DeliveredDate: "$DeliveredDate",
              status: "$status",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCTCOLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "products",
            },
          },
          {
            $project: {
              item: 1,
              status: 1,
              DeliveredDate: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$products", 0] },
            },
          },
        ])
        .toArray();

      resolve(orderItems);
    });
  },
  cancelOrderlist: (data) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .updateOne(
          { _id: objectId(data.orders) },
          {
            $set: {
              status: "cancelled",
            },
          }
        )
        .then((response) => {
          resolve({ cancelItem: true });
        });
    });
  },
  otppassCheck: (data) => {
    let mob = data.contactNo;

    return new Promise(async (resolve, reject) => {
      let validNo = await db
        .get()
        .collection(collection.USERCOLLECTION)
        .findOne({ contactNo: data.contactNo });
      if (validNo) {
        client.verify
          .services(verifySid)
          .verifications.create({ to: `+91${data.contactNo}`, channel: "sms" })
          .then((response) => {
            response.status = true;
            response.user = validNo;
            resolve(response);
          });
      } else {
        resolve({ status: false });
      }
    });
  },
  vlidchck: (data, contactNo) => {
    const otp = data.otp;
    return new Promise(async (resolve, reject) => {
      await client.verify
        .services(verifySid)
        .verificationChecks.create({ to: `+91${contactNo}`, code: otp })
        .then((verification_check) => {
          resolve(verification_check);
        });
    });
  },
  retypePass: (data, contactNoo) => {
    return new Promise(async (resolve, reject) => {
      let newpassword = await bcrypt.hash(data.newpassword, 10);
      await db
        .get()
        .collection(collection.USERCOLLECTION)
        .updateOne(
          { contactNo: contactNoo },
          {
            $set: {
              password: newpassword,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  editAccount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let usersProd = await db
        .get()
        .collection(collection.USERCOLLECTION)
        .findOne({ _id: objectId(userId) });

      resolve(usersProd);
    });
  },
  getMenproduct: () => {
    return new Promise(async (resolve, reject) => {
      let menProduct = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ category: "Mens" })
        .toArray();
      resolve(menProduct);
    });
  },
  getWomenproducts: () => {
    return new Promise(async (resolve, reject) => {
      let womenProduct = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ category: "Women" })
        .toArray();

      resolve(womenProduct);
    });
  },
  accountEdit: (Data, userId) => {
    return new Promise(async (resolve, reject) => {
      let User = await db
        .get()
        .collection(collection.USERCOLLECTION)
        .findOne({ _id: objectId(userId) });
      if (Data.password) {
        let oldPassword = Data.password;
        let newPassword = Data.newPassword;

        bcrypt.compare(oldPassword, User.password).then(async (status) => {
          if (status) {
            if (newPassword) {
              newPassword = await bcrypt.hash(newPassword, 10);

              db.get()
                .collection(collection.USERCOLLECTION)
                .updateOne(
                  { _id: objectId(userId) },

                  {
                    $set: {
                      firstName: Data.firstName,
                      lastName: Data.lastName,
                      password: newPassword,
                    },
                  }
                )
                .then((response) => {
                  response.status = true;
                  resolve(response);
                });
            } else {
              db.get()
                .collection(collection.USERCOLLECTION)
                .updateOne(
                  { _id: objectId(userId) },

                  {
                    $set: {
                      firstName: Data.firstName,
                      lastName: Data.lastName,
                    },
                  }
                )
                .then((response) => {
                  response.status = true;
                  resolve(response);
                });
            }
          } else {
            let response = {};
            response.status = false;

            resolve(response);
          }
        });
      } else {
        db.get()
          .collection(collection.USERCOLLECTION)
          .updateOne(
            { _id: objectId(userId) },

            {
              $set: {
                firstName: Data.firstName,
                lastName: Data.lastName,
              },
            }
          )
          .then((response) => {
            response.status = true;
            resolve(response);
          });
      }
    });
  },
  addressSubmit: (Data, userId) => {
    return new Promise(async (resolve, reject) => {
      let Address = {
        AddreessID: Math.round(Math.random() * 1e9),
        status: "default",
        firstName: Data.firstName,
        lastName: Data.lastName,
        mobile: Data.mobile,
        address: Data.address,
        town: Data.town,

        state: Data.state,
        country: Data.country,
        email: Data.email,
        pincode: Data.pincode,
        company: Data.company,
      };
      await db
        .get()
        .collection(collection.USERCOLLECTION)
        .updateMany(
          { _id: objectId(userId), "Address.status": "default" },
          {
            $set: {
              "Address.$.status": "old",
            },
          }
        );

      await db
        .get()
        .collection(collection.USERCOLLECTION)
        .updateOne(
          { _id: objectId(userId) },
          {
            $push: { Address: Address },
          }
        )
        .then((response) => {
          response.status = true;
          resolve(response);
        });
    });
  },

  getUsers: (userId) => {
    return new Promise(async (resolve, reject) => {
      let usersNow = await db
        .get()
        .collection(collection.USERCOLLECTION)
        .aggregate([
          {
            $match: { _id: objectId(userId) },
          },

          {
            $project: {
              Addresses: "$Address",
            },
          },
          {
            $unwind: "$Addresses",
          },
          {
            $match: {
              "Addresses.status": "default",
            },
          },
        ])
        .toArray();

      if (usersNow == "") {
        let obj = {
          AddreessID: "",
          status: "",
          firstName: "",
          lastName: "",
          mobile: "",
          address: "",
          town: "",

          state: "",
          country: "",
          email: "",
          pincode: "",
          company: "",
        };
        resolve(obj);
      } else {
        resolve(usersNow[0].Addresses);
      }
    });
  },
  allAddresses: (userId) => {
    return new Promise(async (resolve, reject) => {
      let allAddress = db
        .get()
        .collection(collection.USERCOLLECTION)
        .aggregate([
          {
            $match: { _id: objectId(userId) },
          },

          {
            $project: {
              Addresses: "$Address",
            },
          },
          {
            $unwind: "$Addresses",
          },
        ])
        .toArray();
      resolve(allAddress);
    });
  },
  chngeDefault: (adId, userId) => {
    return new Promise(async (resolve, reject) => {
      adId = parseInt(adId);

      await db
        .get()
        .collection(collection.USERCOLLECTION)
        .updateMany(
          { _id: objectId(userId), "Address.status": "default" },
          {
            $set: {
              "Address.$.status": "old",
            },
          }
        );
      await db
        .get()
        .collection(collection.USERCOLLECTION)
        .updateOne(
          { "Address.AddreessID": adId },
          {
            $set: {
              "Address.$.status": "default",
            },
          }
        )
        .then((response) => {
          response.status = true;
          resolve(response);
        });
    });
  },
  paymentStatusChange: (orderId) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              status: "placed",
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  getPagecount: (count) => {
    return new Promise((resolve, reject) => {
      pages = Math.ceil(count / 8);
      let arr = [];
      for (let i = 1; i <= pages; i++) {
        arr.push(i);
      }
      resolve(arr);
    });
  },
  getEightProducts: (Pageno) => {
    return new Promise(async (resolve, reject) => {
      let val = (Pageno - 1) * 8;
      let AllProducts_ = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find()
        .sort({ _id: -1 })
        .skip(val)
        .limit(8)
        .toArray();

      resolve(AllProducts_);
    });
  },
  TotalProductView: (Pageno, lmt) => {
    let skipNum = parseInt((Pageno - 1) * lmt);

    return new Promise(async (resolve, reject) => {
      let Products = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find()
        .skip(skipNum)
        .limit(lmt)
        .toArray();
      resolve(Products);
    });
  },
  SrchPro: (SrchItem) => {
    return new Promise(async (resolve, reject) => {
      let SrchRslt = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({
          $or: [
            { brand: { $regex: SrchItem, $options: "i" } },
            { title: { $regex: SrchItem, $options: "i" } },
            { category: { $regex: SrchItem, $options: "i" } },
          ],
        })
        .toArray();

      if (SrchRslt.length > 0) {
        resolve(SrchRslt);
      }

      reject();
    });
  },
  checkCoupon: (Data, Total) => {
    return new Promise(async (resolve, reject) => {
      let validCoupon = await db
        .get()
        .collection(collection.COUPONCOLLECTION)
        .findOne({ couponid: Data.coupon, date: { $gte: new Date() } });

      if (validCoupon != null) {
        let offerPer = parseInt(validCoupon.offerpercentage);

        let discAmt = (Total * offerPer) / 100;
        discAmt = Math.trunc(discAmt);

        let maxReduction = parseInt(validCoupon.reducedmaxamount);

        if (discAmt >= maxReduction) {
          var totalAmt = Total - maxReduction;
          let offer = {};
          offer.totalAmt = totalAmt;
          offer.discAmt = maxReduction;

          resolve(offer);
        } else {
          var totalAmt = Total - discAmt;
          let offer = {};
          offer.totalAmt = totalAmt;
          offer.discAmt = discAmt;
          resolve(offer);
        }
      } else {
        let offer = {};
        offer.totalAmt = 0;
        offer.discAmt = 0;
        resolve(offer);
      }
    });
  },
  returnOrder: (Id) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .updateOne(
          { _id: objectId(Id) },
          {
            $set: {
              status: "Returned",
            },
          }
        );
      resolve(response);
    });
  },
  generateRazorpay: (orderId, Price) => {
    return new Promise(async (resolve, reject) => {
      var options = {
        amount: Price,
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
        } else {
          resolve(order);
        }
      });
    });
  },
  verifyPaymentRazorpay: (orderId) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .updateOne(
          { _id: objectId(orderId) },
          {
            $set: {
              status: "placed",
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },

  addtoWish: (ProId, UserId) => {
    let proObj = {
      item: objectId(ProId),
    };
    return new Promise(async (resolve, reject) => {
      let userWish = await db
        .get()
        .collection(collection.WISHCOLLECTION)
        .findOne({ user: objectId(UserId) });
      if (userWish) {
        let proExist = userWish.product.findIndex(
          (product) => product.item == ProId
        );

        if (proExist != -1) {
          resolve();
        } else {
          await db
            .get()
            .collection(collection.WISHCOLLECTION)
            .updateOne(
              { user: objectId(UserId) },
              {
                $push: { product: proObj },
              }
            )
            .then((response) => {
              resolve({ status: true });
            });
        }
      } else {
        let wishObj = {
          user: objectId(UserId),
          product: [proObj],
        };
        await db
          .get()
          .collection(collection.WISHCOLLECTION)
          .insertOne(wishObj)
          .then((response) => {
            resolve({ status: true });
          });
      }
    });
  },
  wishItemview: (userId) => {
    return new Promise(async (resolve, reject) => {
      let wishItems = await db
        .get()
        .collection(collection.WISHCOLLECTION)
        .aggregate([
          {
            $match: { user: objectId(userId) },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.item",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCTCOLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $project: {
              item: 1,
              product: 1,
            },
          },
        ])
        .toArray();

      resolve(wishItems);
    });
  },
  removeProductwish: (data) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.WISHCOLLECTION)
        .updateOne(
          { _id: objectId(data.wish) },
          {
            $pull: { product: { item: objectId(data.product) } },
          }
        )
        .then((response) => {
          resolve({ removeItem: true });
        });
    });
  },
};
