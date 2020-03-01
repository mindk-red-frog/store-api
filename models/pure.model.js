const AppError = require("./../utils/appError");
const BaseModel = require("./base.model");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const helper = require("./../utils/helper");

//class uses Knex.schema methods
class Pure extends BaseModel {
  constructor(req, res, next) {
    super();
    Object.assign(this, req);
  }
  //check some user input parameteres
  checkIntValue(field, fieldName, returnError = true) {
    if (field) {
      const rexExp = /^[0-9]+$/g;
      const isIntTrue = rexExp.test(field);

      if (!isIntTrue && returnError === true) {
        return this.next(
          new AppError(`${fieldName} must be a single and integer value`, 400)
        );
      } else if (!returnError) {
        return isIntTrue;
      }
    }
  }

  ////PRODUCTS section
  insertNewProduct = () => {
    let newId;
    //start PostgreSQL transaction
    return this.table.transaction(async trx => {
      try {
        await trx
          .insert({
            title: this.body.title,
            manufacturer: this.body.manufacturer,
            quantity: this.body.quantity,
            price: this.body.price,
            photo: this.body.photo,
            description: this.body.description,
            available: this.body.available,
            valid_until: this.body.valid_until,
            weight: this.body.weight
          })
          .returning("id")
          .into("products")
          .then(async id => {
            //if user specified just 1 cat_id parameter
            if (
              Number.isInteger(parseInt(this.body.cat_id, 10)) &&
              this.body.cat_id.indexOf(",") === -1
            ) {
              //console.log("thatBlock");
              this.body.cat_id = parseInt(this.body.cat_id, 10);
              //insert data
              await trx
                .insert({
                  category_id: this.body.cat_id,
                  product_id: id[0]
                })
                .into("product_to_category_list");
            } else if (this.body.cat_id.indexOf(",") > -1) {
              //if user specified more than 1 parameter
              //get id from comma separeted string
              const catsId = this.body.cat_id.split(",");
              //insert records to compliance list
              catsId.forEach(async el => {
                let curentCatId = parseInt(el, 10);
                await trx
                  .insert({
                    category_id: curentCatId,
                    product_id: id[0]
                  })
                  .into("product_to_category_list");
              });
              //console.log(catsId);
            }
            //products.id
            newId = id[0];
          });
      } catch (err) {
        return await this.next(new AppError(err));
      }
      //console.log(newId);
      return { id: newId };
    });
  };

  ////updateProduct

  updateProduct = () => {
    let newId;
    const { id } = this.params;
    this.checkIntValue(this.body.manufacturer, "manufacturer");
    //start PostgreSQL transaction
    return this.table.transaction(async trx => {
      try {
        return await trx("products")
          .update({
            title: this.body.title,
            manufacturer: this.body.manufacturer,
            quantity: this.body.quantity,
            price: this.body.price,
            photo: this.body.photo,
            description: this.body.description,
            available: this.body.available,
            valid_until: this.body.valid_until,
            weight: this.body.weight
          })
          .where("id", id)
          .then(async () => {
            //if user specified just 1 cat_id parameter
            if (
              Number.isInteger(parseInt(this.body.cat_id, 10)) &&
              this.body.cat_id.indexOf(",") === -1
            ) {
              //console.log("single");
              this.body.cat_id = parseInt(this.body.cat_id, 10);

              await trx("product_to_category_list")
                .where("product_id", id)
                .del();
              console.log(
                "this.body.cat_id",
                typeof this.body.cat_id,
                "product_id",
                typeof id
              );

              return await trx
                .insert({
                  category_id: this.body.cat_id,
                  product_id: id * 1
                })
                .into("product_to_category_list")
                .returning("product_id")
                .catch(err => {
                  //console.log(err);
                });
              //if user specified more than 1 parameter
              //get id from comma separeted string
            } else if (this.body.cat_id.indexOf(",") > -1) {
              //console.log("plural");

              await trx("product_to_category_list")
                .where("product_id", id)
                .del()
                .catch(err => {
                  return this.next(new AppError(err.detail, 400));
                });

              const catsId = this.body.cat_id.split(",");
              catsId.forEach(async el => {
                let curentCatId;
                //check if user put a letters instead of numbers
                if (!isNaN(parseInt(el, 10))) {
                  curentCatId = parseInt(el, 10);
                } else {
                  return await this.next(
                    new AppError("Please check yor cat_id value", 400)
                  );
                }
                await trx
                  .insert({
                    category_id: curentCatId,
                    product_id: id
                  })
                  .into("product_to_category_list")
                  .returning("id")
                  .catch(err => {
                    return this.next(new AppError(err.detail, 400));
                  });
              });
              return [id];
            }
          });
      } catch (err) {
        return await this.next(new AppError(err));
      }
    });
  };

  ////deleteProduct
  deleteProduct = async () => {
    const { id } = this.params;
    //start PostgreSQL transaction
    const deleteProduct = await this.table.transaction(async trx => {
      try {
        await trx("product_to_category_list")
          .where("product_id", id)
          .del();

        return await trx("products")
          .where("id", id)
          .del();
        returning("*");
      } catch (err) {
        return await this.next(new AppError(err));
      }
      //console.log(newId);
      //return { id, message: "Product data was updated" };
    });

    if (typeof deleteProduct !== "undefined" && deleteProduct === 1) {
      return { code: 204 };
    } else {
      return { code: 404, message: "nothing to delete" };
    }
  };

  /////////

  getOneProduct = async () => {
    const { id } = this.params;
    //get all fields that we need + join some data from products
    const oneProduct = await this.table
      .select(
        "products.id",
        "title",
        "manufacturer",
        "quantity",
        "price",
        "photo",
        "description",
        "available",
        "valid_until",
        "weight",
        this.table.raw(
          "array_to_string(array_agg(product_to_category_list.category_id), ',') as category_id"
        )
      )
      .where("products.id", id)
      .from("products")
      .innerJoin(
        "product_to_category_list",
        "products.id",
        "product_to_category_list.product_id"
      )
      .groupBy("products.id");

    if (typeof oneProduct !== "undefined" && oneProduct.length) {
      return oneProduct;
    } else {
      return { code: 204 };
    }
  };

  //getAllProducts
  getAllProducts() {
    const allowedFields = ["category_id", "manufacturer", "price", "page"];
    this.checkIntValue(this.query.limit, "limit");
    //query LIMIT default value
    const perPageLimit = this.query.limit * 1 || 10;
    //default Value = (0 if undefined) or value
    const offsetLimit = (this.query.page * 1 - 1) * perPageLimit * 1 || 0;
    //asc||desc params for query
    const allowedOrder = ["asc", "desc"];
    const order = allowedOrder.includes(this.query.order)
      ? this.query.order
      : "asc";
    /// order BY ["id","title", "quantity","price","available","valid_until"]
    const allowedOrderBy = [
      "id",
      "title",
      "quantity",
      "price",
      "available",
      "valid_until"
    ];
    const orderBy = allowedOrderBy.includes(this.query.orderby)
      ? this.query.orderby
      : "id";
    //console.log(order);

    return this.table
      .where(builder => {
        //generation of WHERE param string
        Object.keys(this.query).forEach(el => {
          //filtering, allow just properties from [allowedFields]

          if (allowedFields.includes(el)) {
            if (el === "price") {
              /// check the price[op] value to get a condition operator and build a query.
              /// Price options: [e||gt|lt|gte|lte]
              Object.keys(this.query[el]).forEach(op => {
                if (isNaN(this.query.price[op]))
                  return this.next(
                    new AppError("Price must be an numeric value", 400)
                  );
                console.log("op: ", op, " el:", el);
                let sqlOperator;
                switch (op) {
                  // e - equals
                  case "e":
                    sqlOperator = "=";
                    builder.where("price", sqlOperator, this.query.price[op]);
                    break;
                  // lt = less than
                  case "lt":
                    sqlOperator = "<";
                    builder.where("price", sqlOperator, this.query.price[op]);
                    break;
                  //gt - greater than
                  case "gt":
                    sqlOperator = ">";
                    builder.where("price", sqlOperator, this.query.price[op]);
                    break;
                  //lte - less than or equal
                  case "lte":
                    sqlOperator = "<=";
                    builder.where("price", sqlOperator, this.query.price[op]);
                    break;
                  //gte - greater than or equal
                  case "gte":
                    sqlOperator = ">=";
                    builder.where("price", sqlOperator, this.query.price[op]);
                    break;

                  default:
                    return this.next(
                      new AppError(
                        "Price [param_value] has to match one of this value: q|lt|gt|lte|gte",
                        400
                      )
                    );
                    break;
                }
              });
            } else {
              //check data from query string, manufacturer must contain integer value
              if (el === "manufacturer") {
                this.checkIntValue(this.query[el], "manufacturer");
                builder.where(el, this.query[el]);
              }
              if (el === "page") {
                this.checkIntValue(this.query[el], "page");
                if (this.query[el] < 1) {
                  return this.next(
                    new AppError(
                      "Page number must have 1 or greater value",
                      400
                    )
                  );
                }
              }
              if (el === "category_id") {
                const rexExp = /^[0-9,]+$/g;

                if (this.checkIntValue(this.query[el], "category_id", false)) {
                  console.log("HEre1. this.query[el]: ", this.query[el]);

                  builder.where(el, this.query[el]);
                } else if (
                  !isNaN(this.query[el]) ||
                  rexExp.test(this.query[el])
                ) {
                  //console.log("this_part");
                  const requestedCategories = this.query[el]
                    .split(",")
                    .filter(el => {
                      //filter blank elements like
                      //category_id = 3,
                      //or
                      //category_id = 3,,,,,4,,,,5,
                      if (el) return el;
                    });
                  // console.log(requestedCategories);

                  //console.log(" a few values");
                  builder.whereIn(el, requestedCategories);
                } else if (isNaN(this.query[el])) {
                  console.log("HEre3");
                  return this.next(
                    new AppError(
                      "category_id must be an integer value or a few integer comma separated values",
                      400
                    )
                  );
                }
              }
            }
          }
        });
        //console.log("offset", offsetLimit);
      })
      .select(
        "products.id",
        "title",
        "manufacturer",
        "quantity",
        "price",
        "photo",
        "description",
        "available",
        "valid_until",
        "weight",
        this.table.raw(
          "array_to_string(array_agg(product_to_category_list.category_id), ',') as category_id"
        ),
        this.table.raw("count(*) OVER() AS full_count"),
        this.table.raw(`${offsetLimit} as offset`),
        this.table.raw(`${perPageLimit} as limit`)
      )
      .from("products")
      .innerJoin(
        "product_to_category_list",
        "products.id",
        "product_to_category_list.product_id"
      )
      .groupBy("products.id")
      .limit(perPageLimit)
      .offset(offsetLimit)
      .orderBy(orderBy, order);

    //.toSQL()
    //.toNative();
  }

  //auth Section
  //cnangePersonalPassword
  changePersonalPassword = async filteredBody => {
    filteredBody.password = await bcrypt.hash(filteredBody.password, 12);
    //start PostgreSQL transaction
    const personalPassword = await this.table.transaction(async trx => {
      try {
        return await trx("users")
          .update({ password: filteredBody.password })
          .where("id", this.user.id)

          .then(async () => {
            return await trx("tokens")
              .where("user_id", this.user.id)
              .del();
          });
      } catch (err) {
        return await this.next(new AppError(err));
      }
    });

    if (typeof personalPassword !== "undefined" && personalPassword) {
      return {
        userId: this.user.id,
        message: "Password was changed. Please re-login"
      };
    } else {
      return { code: 400 };
    }
  };

  ///

  //ORDERS Section
  addToCart = async => {
    let currentProductShopQuantity,
      newId,
      isProdIdInOrderLoop = false;
    //start PostgreSQL transaction
    return this.table.transaction(async trx => {
      try {
        ///check does product exist and is it more/equal than customer tries to order
        await trx
          .select("id", "quantity")
          .from("products")
          .where("id", this.params.id)
          .returning("id", "quantity")
          .catch(err => {
            console.log(err);
            return this.next(new AppError(err.detail, 400));
          })
          .then(async product => {
            //is product record with params.is isset in db
            console.log("-----------", product);

            if (!product.length) {
              return this.next(new AppError("Wrong product id", 400));
            }
            //is product quanity enought
            if (product[0].quantity < this.params.quantity) {
              //console.log("EXCEPTION");

              return this.next(
                new AppError(
                  "The shop doesn't have as many product items as you try to order",
                  400
                )
              );
            }
            currentProductShopQuantity = product[0];
          });
        /// check do we have openedCart or not
        return await trx
          .select("id", "active")
          .from("orders_list")
          .where("user_id", this.user.id)
          .andWhere("active", true)
          .returning("id")

          .catch(err => {
            console.log(err);
            return this.next(new AppError(err.detail, 400));
          })

          .then(async orderInOrdersList => {
            // console.log("firstRetId: ", id);

            //if we dont have openedCart
            if (orderInOrdersList.length === 0) {
              //console.log("empty");
              //console.log(helper.jsToPgTimeStamp(Date.now()));

              //create new Order in orders_list
              return await trx
                .insert({
                  user_id: this.user.id,
                  active: true,
                  added: helper.jsToPgTimeStamp(Date.now())
                })
                .into("orders_list")
                .returning("id")
                .catch(err => {
                  console.log(err);
                })
                .then(async id => {
                  //insert new rows to orders with product_id and quantity for current openedOrder
                  return await trx
                    .insert({
                      order_id: id * 1,
                      product_id: this.params.id * 1,
                      quantity: this.params.quantity * 1
                    })
                    .into("orders")
                    .returning("product_id", "quantity", "order_id")
                    /*.then(async id => {
                      console.log("ID FROM orders: ", id);
                    })*/
                    .catch(err => {
                      console.log(err);
                    });
                  console.log(b);
                });
            } else {
              //if Orderd already created and status active:true

              //check, have we already added item with the same product_id
              return await trx
                .select("order_id", "product_id", "quantity")
                .from("orders")
                .where("order_id", orderInOrdersList[0].id * 1) ///orderInOrdersList[0] - currentDataFrom orders in DB
                .returning("order_id", "product_id", "quantity")
                .then(async prod_in_orders => {
                  //if smth is already  in the cart
                  if (prod_in_orders.length) {
                    //console.log("prod_in_orders:", prod_in_orders);
                    //check all items in one current opened cart

                    prod_in_orders.map(async ordersProd => {
                      ordersProd.order_id *= 1;
                      //if user put to the cart product that alredy was there

                      if (ordersProd.product_id === this.params.id * 1) {
                        //we have a current prod_id in the cart, so we need to reject creating a new one
                        isProdIdInOrderLoop = true;

                        ordersProd.quantity += this.params.quantity * 1;
                        /*console.log(
                          "shop.product.quantity",
                          currentProductShopQuantity.quantity
                        );*/
                        /*console.log(ordersProd.quantity);
                        console.log(currentProductShopQuantity.quantity);*/

                        //check if summ quantity (old quantity in card + new quantiy) <= shop has
                        if (
                          ordersProd.quantity >
                          currentProductShopQuantity.quantity
                        ) {
                          return this.next(
                            new AppError(
                              "You're trying to put to your cart more items that shop has"
                            )
                          );
                        } else {
                          //if it's enought quantity of product, update the open cart details

                          console.log("EXIST and update ");
                          console.log("che");
                          await trx("orders")
                            .update({
                              quantity: ordersProd.quantity
                            })
                            .where("product_id", ordersProd.product_id)
                            .andWhere("order_id", ordersProd.order_id)
                            .returning("*")
                            .catch(err => {
                              console.log(err);
                            });
                        }
                      }
                    });

                    if (!isProdIdInOrderLoop) {
                      /// if open order is exist, and user tryes to add a product with a new product_id
                      /* console.log(
                        "EXIST but at least one product already in cart "
                      );
                      */

                      return await trx
                        .insert({
                          order_id: orderInOrdersList[0].id,
                          product_id: this.params.id,
                          quantity: this.params.quantity
                        })
                        .into("orders")
                        .returning("*")
                        .catch(err => {
                          console.log(err);
                        });
                    } else {
                      const arrResponse = [
                        {
                          operation: "added to order",
                          product_id: this.params.id,
                          quantity: this.params.quantity,
                          order_id: orderInOrdersList[0].id
                        }
                      ];
                      return arrResponse;
                    }
                  } else {
                    //console.log("EXIST but WAS empty cart ");

                    //adding the first product to the cart [if all goods was deleted from the order]
                    return await trx
                      .insert({
                        order_id: orderInOrdersList[0].id,
                        product_id: currentProductShopQuantity.id,
                        quantity: this.params.quantity * 1
                      })
                      .into("orders")
                      .returning("*")
                      .catch(err => {
                        console.log(err);
                      });
                  }
                });
            }
          });
      } catch (err) {
        return await this.next(new AppError(err));
      }
    });
  };
  //
  //deleteFromCart
  deleteFromCart = async () => {
    const { id } = this.params;
    //start PostgreSQL transaction
    return this.table.transaction(async trx => {
      try {
        return await trx
          .select("id")
          .from("orders_list")
          .where("user_id", this.user.id)
          .andWhere("active", true)
          .returning("id")
          .then(async orderData => {
            return await trx
              .select("id")
              .from("orders")
              .where("product_id", id)
              .andWhere("order_id", orderData[0].id)
              .returning("id", "quantity")
              .catch(err => {
                console.log(err);
                return this.next(new AppError(err.detail, 400));
              })
              .then(async product => {
                //is order record with product_id isset in db prders in current user cart
                // product = [ { id: 'xxx' } ]

                if (!product.length) {
                  return this.next(
                    new AppError("You don't have this item in your cart", 400)
                  );
                }
                //if product quanity enought

                return await trx
                  .del()
                  .from("orders")
                  .where("id", product[0].id)
                  .returning("*");
              });
          });
      } catch (err) {
        console.log(err);
      }
    });
  };

  //
  //getOneOrder
  getOneOrder = async () => {
    const { id } = this.params;
    //start PostgreSQL transaction
    return this.table.transaction(async trx => {
      try {
        const oneOrder = await trx
          .select("id")
          .from("orders_list")
          .where("user_id", this.user.id)
          .returning("id")
          .then(async orderData => {
            console.log("orderData", orderData);

            return await trx
              .select(
                "orders.product_id",
                "products.title",
                "orders.quantity",
                "products.price",
                "orders_list.user_id"
              )
              .from("orders")
              .where("order_id", id)
              .innerJoin("products", "orders.product_id", "=", "products.id")
              .innerJoin("orders_list", "orders.order_id", "orders_list.id")
              .returning("id", "quantity", "product_id", "user_id");
          });

        if (typeof oneOrder !== "undefined" && oneOrder.length) {
          return oneOrder;
        } else {
          return { code: 204 };
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  //
  //getAllOrders
  getAllOrders = async () => {
    //start PostgreSQL transaction
    return this.table.transaction(async trx => {
      try {
        return await trx
          .select("id")
          .from("orders_list")
          .where("user_id", this.user.id)
          .returning("id")
          .then(async orderData => {
            const allRowsFromAllUserOrders = await trx
              .select(
                "orders.product_id",
                "products.title",
                "orders.quantity",
                "products.price",
                "orders.order_id"
              )
              .from("orders")
              // .where("order_id", id)
              .where(builder => {
                builder.where("order_id", orderData[0]["id"]);

                for (let i = 0; i < orderData.length; i++) {
                  builder.orWhere("order_id", orderData[i]["id"]);
                }
              })

              .innerJoin("products", "orders.product_id", "=", "products.id")
              .returning("id", "quantity", "product_id", "user_id", "order_id");

            let allUserOrders = {};
            // AllOrders Response list generation. Goods from the same order will be grouped to one order
            for (let i = 0; i < allRowsFromAllUserOrders.length; i++) {
              let order = allRowsFromAllUserOrders[i];
              // if we don't have an array with the same key we create it
              if (!allUserOrders[order.order_id])
                allUserOrders[order.order_id] = [];

              allUserOrders[order.order_id].push({
                title: order.title,
                quantity: order.quantity,
                product_id: order.product_id
              });
            }

            return allUserOrders;
          });
      } catch (err) {
        console.log(err);
      }
    });
  };

  //checkout
  checkout = async () => {
    //allow just allowed fields from body
    const allowedFields = [
      "delivery_type",
      "delivery_address",
      "contact_phone"
    ];
    //obj for further proccesing
    const filteredBody = {};
    Object.keys(this.body).forEach(el => {
      if (allowedFields.includes(el)) filteredBody[el] = this.body[el];
    });

    //start PostgreSQL transaction
    return await this.table.transaction(async trx => {
      try {
        //check if we have active order
        const checkout = await trx
          .select("id", "active")
          .from("orders_list")
          .where("user_id", this.user.id)
          .andWhere("active", true)
          .returning("id")
          /*.then(async orderData => {
            
          })*/
          .catch(err => {
            console.log(err);
            return this.next(new AppError(err.detail, 400));
          })

          .then(async orderData => {
            //if orderData is undefined we throw exception
            if (!orderData.length) {
              return this.next(
                new AppError(
                  "You don't have active orders. Please add first product to your cart",
                  400
                )
              );
            }
            /************* Removing products from shop */

            //getting information about products_id and quantity (in users cart) that user is going to order
            await trx
              .select("orders.product_id", "orders.quantity")
              .from("orders")
              .where("order_id", orderData[0].id)
              .returning("product_id", "quantity")
              .then(async clientsOrder => {
                //console.log("clientsOrder", clientsOrder);

                //getting information about quantity of goods that left in a shop
                return await trx
                  .select("id", "quantity")
                  .from("products")
                  .where(builder => {
                    builder.where("id", clientsOrder[0]["product_id"]);
                    //get all rows from products that match to user's cart
                    for (let i = 0; i < clientsOrder.length; i++) {
                      builder.orWhere("id", clientsOrder[i]["product_id"]);
                    }
                  })

                  .returning("product_id", "quantity")
                  .then(async shopsProductAvailableQuantity => {
                    console.log(
                      "shopsProductAvailableQuantity",
                      shopsProductAvailableQuantity
                    );
                    //console.log("clientsOrder", clientsOrder);
                    //obj for further update new quantity in shop
                    const quantityForUpdate = {};
                    for (
                      let i = 0;
                      i < shopsProductAvailableQuantity.length;
                      i++
                    ) {
                      if (
                        //if it's enought quantity in the shop in a current mometn before checkout
                        shopsProductAvailableQuantity[i].quantity <
                        clientsOrder[i].quantity
                      ) {
                        return this.next(
                          new AppError(
                            "The shop desn't have enought quantity of one of your products. Please check if your goods in cart are available now",
                            400
                          )
                        );
                      } else {
                        //{ 'product_id': newQuantityParameter, '183': 21 }
                        quantityForUpdate[shopsProductAvailableQuantity[i].id] =
                          shopsProductAvailableQuantity[i].quantity -
                          clientsOrder[i].quantity;
                      }
                    }
                    //console.log("quantityForUpdate3", quantityForUpdate);

                    Object.keys(quantityForUpdate).forEach(async el => {
                      //console.log(el, quantityForUpdate[el]);
                      //update products with updated data about how many items left
                      return await trx("products")
                        .update({
                          quantity: quantityForUpdate[el]
                        })
                        .where("id", el)
                        .returning("*")
                        .then(async result => {
                          console.log(result);
                        });
                    });
                  });
              });

            /*************/

            let availableDelivery = await trx
              .select("id")
              .from("delivery")
              .returning("id");
            availableDelivery = availableDelivery.map(el => el.id * 1);
            //console.log("delivery", availableDelivery); //[ '1', '2', '3', '4' ]
            if (
              availableDelivery.indexOf(filteredBody.delivery_type * 1) === -1
            ) {
              return this.next(new AppError("Wrong delivery_type id"));
            }

            return await trx("orders_list")
              .update({
                active: false,
                delivery_type: filteredBody.delivery_type * 1,
                delivery_address: filteredBody.delivery_address,
                contact_phone: filteredBody.contact_phone,
                checkout: helper.jsToPgTimeStamp(Date.now())
              })
              .where("id", orderData[0].id)
              .returning("*");

            //
          });

        if (typeof checkout !== "undefined" && checkout.length) {
          return checkout;
        } else {
          return { code: 204 };
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  //updateOrder
  updateOrder = async () => {
    //allow just allowed fields from body
    const allowedFields = [
      "active",
      "delivery_type",
      "delivery_address",
      "contact_phone"
    ];
    //obj filteredBody for further proccesing [db query]
    const filteredBody = {};
    Object.keys(this.body).forEach(el => {
      if (allowedFields.includes(el)) {
        if (el === "delivery_type") {
          filteredBody[el] = parseInt(this.body[el], 10);
        }
        filteredBody[el] = this.body[el];
      }
    });

    //console.log("filteredBody", filteredBody);
    //start PostgreSQL transaction
    return await this.table.transaction(async trx => {
      try {
        //check if we have active order
        return await trx
          .select("id", "active")
          .from("orders_list")
          .where("id", this.params.id)
          .returning("id")
          .catch(err => {
            console.log(err);
            return this.next(new AppError(err.detail, 400));
          })
          .then(async orderData => {
            //if orderData is undefined we throw exception
            if (!orderData.length) {
              return this.next(new AppError("This order doesn't exist", 400));
            }

            /******Getting the correct delivery types list*******/

            let availableDelivery = await trx
              .select("id")
              .from("delivery")
              .returning("id");
            availableDelivery = availableDelivery.map(el => el.id * 1);
            //console.log("delivery", availableDelivery); //[ '1', '2', '3', '4' ]
            //user can not to specify all of fields. It's ok for strings but not for query with '' for integer type_id field
            if (
              typeof filteredBody.delivery_type !== "undefined" &&
              availableDelivery.indexOf(filteredBody.delivery_type * 1) === -1
            ) {
              //console.log(typeof filteredBody.delivery_type !== "undefined");

              return this.next(new AppError("Wrong delivery_type id"));
            }
            //console.log(filteredBody);

            return await trx("orders_list")
              .update(filteredBody)
              .where("id", orderData[0].id)
              .returning("*");

            //
          });
      } catch (err) {
        console.log(err);
      }
    });
  };

  //deleteOrder
  deleteOrder = async () => {
    //check if Id an integer
    this.checkIntValue(this.params.id, "id");
    //start PostgreSQL transaction
    return await this.table.transaction(async trx => {
      try {
        //check if certain order exist
        return await trx
          .select("id")
          .from("orders_list")
          .where("id", this.params.id)
          .returning("id")
          .catch(err => {
            console.log(err);
            return this.next(new AppError(err.detail, 400));
          })
          .then(async orderData => {
            //if orderData is undefined we throw exception
            if (!orderData.length) {
              return this.next(new AppError("This order doesn't exist", 400));
            }
            //delete order and goods from cart
            await trx("orders_list")
              .where("id", this.params.id)
              .del();
            return await trx("orders")
              .where("order_id", this.params.id)
              .del()
              .returning("*");

            //
          });
      } catch (err) {
        console.log(err);
      }
    });
  };
  //
}

module.exports = Pure;
