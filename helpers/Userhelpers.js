var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt');
const { resolve } = require('path');
var objectId=require('mongodb').ObjectId
const accountSid = "AC8ac2c6332729c28573b0c0039258a15f";
const authToken = '00d0c3b74aa62dedf3b6043c5068c362';
const verifySid = 'VA64162928165b69fa61d327c24f6f5fe7 ';
const client = require("twilio")(accountSid, authToken);
let mob;
module.exports=
{

doUserLOgin:(user)=>
{
 
    return new Promise(async(resolve,reject)=>
    {
        

        let response={}
    let validuser= await db.get().collection(collection.USERCOLLECTION).findOne({email:user.email})
     if(validuser )
     {
        bcrypt.compare(user.password,validuser.password).then((status)=>
        {
            if(status)
            {
            
                response.validuser=validuser;
                response.status=true
                resolve(response)
            }
            else
            {
                
                resolve({status:false})
            }
        })
        }
    })
},

    

addUserSignup:(user)=>

{  
   
   
    return new Promise(async(resolve,reject)=>
    {
        let userold={}
        let olduser=await db.get().collection(collection.USERCOLLECTION).findOne({email:user.email})
        if(olduser)
        {
            userold.status=true
            
            resolve(userold)

        }
        else
        user.status=true;
        user.password= await bcrypt.hash(user.password,10)

        db.get().collection(collection.USERCOLLECTION).insertOne(user)
        resolve({status:false})
        
         resolve (user);
    
    })

},
 Dootplogin:(data)=>
 {
    
    let mob=data.contactNo;
 
   return new Promise(async(resolve,reject)=>
   {
    
     let validNo =  await db.get().collection(collection.USERCOLLECTION).findOne({contactNo:data.contactNo})
     if(validNo)
     
   {  
     
     client.verify.services(verifySid).verifications.create({to:`+91${data.contactNo}`,channel:'sms'})
        .then((response)=>{
            response.status=true
            response.user=validNo
        resolve(response)
        })
   }
   else
        {
           
           resolve({status:false})
        }
})
 },
 validOtp:(data,contactNo)=>
 {
    const otp=data.otp
    return new Promise(async (resolve,reject)=>
    {
    await client.verify.services(verifySid).verificationChecks.create({to:`+91${contactNo}`,code:otp}).then((verification_check)=>
       {
        
        resolve(verification_check)
    
        
        
    })

 })
 },


 otpvc:(data,contactNo)=>
 {

const otp=data.otp
    return new Promise(async (resolve,reject)=>
    {
    await client.verify.services(verifySid).verificationChecks.create({to:`+91${contactNo}`,code:otp}).then((verification_check)=>
       {
        
        resolve(verification_check)
    
        
        
    })

 })

},
getAllproducts:()=>
{
    return new Promise(async(resolve,reject)=>
    {
        let products= await db.get().collection(collection.PRODUCTCOLLECTION).find().toArray()
        
        resolve(products)
      })
   
},
viewproductUser:(productid)=>
{
    
  
    return new Promise(async(resolve,reject)=>
    {
        let products= await db.get().collection(collection.PRODUCTCOLLECTION).findOne({_id:objectId(productid)})
        
            resolve(products)
        })
    },
    addTocart:(productid,userid)=>
    {
        let proObj={
            item:objectId(productid),
            quantity:1
        }
        return new Promise(async(resolve,reject)=>
        {
            let userCart=await db.get().collection(collection.CARTCOLLECTION).findOne({user:objectId(userid)})
            if(userCart)
            {
             let proExist =userCart.product.findIndex(product=>product.item==productid)   
             
             if(proExist!=-1)
             {
             db.get().collection(collection.CARTCOLLECTION).updateOne({user:objectId(userid),'product.item':objectId(productid)},
            { 
               $inc:{'product.$.quantity':1} 
             }
             ).then((response)=>
             {
                resolve({status:false})
             })
            }
             else{

             
             await db.get().collection(collection.CARTCOLLECTION)
            .updateOne({user:objectId(userid)},
            {
                
                    $push:{product:proObj}
                }
                ).then((response)=>
                {
                    resolve({status:true})
                })
             }
            }
            
            
            else
            {
                let cartObj=
                {
                    user:objectId(userid),
                    product:[proObj]
                }
               await db.get().collection(collection.CARTCOLLECTION).insertOne(cartObj).then((response)=>
                {
                    resolve({status:true})

                })
            }
        })
    },
    cartView:(userid)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            let cartItems=await db.get().collection(collection.CARTCOLLECTION).aggregate([
                {
                    $match:{user:objectId(userid)}
                },
                {
                    $unwind:'$product'
                },
                {
                    $project:{
                        item:'$product.item',
                        quantity:'$product.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCTCOLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:1,
                        total:{$sum:{$multiply:[{$toDouble:'$quantity'},{$toDouble:'$product.price'}]}}
                    }
                }
                // {
                //    $lookup:{
                //     from:collection.PRODUCTCOLLECTION,
                //     let: {prolist:'$product'},
                //     pipeline:[{
                //        $match:{
                //         $expr:
                //         {
                //             $in:['$_id','$$prolist']
                            

                            
                //         }
                //        } 
                //     }],

                //   as:
                //     'cartItems'
                  
                //    } 
                // }
            ]).toArray()
           
                resolve(cartItems)
            
           
            })
            
           
      
    },
    getcartCount:(userId)=>
    {
        return new Promise(async(resolve,reject)=>
        {   let count=0
            let cart=await db.get().collection(collection.CARTCOLLECTION).findOne({user:objectId(userId)})
            if(cart)
            {
            count=count+cart.product.length
            }
            resolve(count)
        })
    },
    changeProductquantity:(data)=>
    {   let quantity=parseInt(data.quantity)
        let count =parseInt(data.count)
        return new Promise(async(resolve,reject)=>
        {

        
        if(data.count==-1 && data.quantity==1)
        {
           await db.get().collection(collection.CARTCOLLECTION).updateOne({_id:objectId(data.cart)},
            {
                $pull:{product:{item:(objectId(data.product))}}
            }).then((response)=>
            {
                resolve({removeProduct:true})
            })
        }
        else
        {
      
           await db.get().collection(collection.CARTCOLLECTION).updateOne({_id:objectId(data.cart),'product.item':objectId(data.product)},
            {  
                
               $inc:{'product.$.quantity':count} 
             }
             ).then((response)=>
             {
                resolve(true)
             })
            }
    })
},
removeProductcart:(data)=>
{
    return new Promise(async(resolve,reject)=>
    {
        await db.get().collection(collection.CARTCOLLECTION).updateOne({_id:objectId(data.cart)},
        {
            $pull:{product:{item:(objectId(data.product))}}
        }).then((response)=>
        {
            resolve({removeItem:true})
        })
    })
},
getTotal:(userid)=>
{ 
    return new Promise(async(resolve,reject)=>
    {
       let Total= await db.get().collection(collection.CARTCOLLECTION).aggregate([
            {
                $match:{user:objectId(userid)}
            },
            {
                $unwind:'$product'
            },
            {
                $project:{
                    item:'$product.item',
                    quantity:'$product.quantity'
                }
            },
            {
                $lookup:{
                    from:collection.PRODUCTCOLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                }
            },
            {
                $project:{
                    item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                }
            },
            {
                $group:{
                    _id:null,
                    total:{$sum:{$multiply:[{$toDouble:'$quantity'},{$toDouble:'$product.price'}]}}
                }
            }
            
        ]).toArray()
    
        
        resolve(Total)
    

    
    })
    
    },
    orderPost:(order,userId,product,total)=>
    {
        console.log(order,'vannu')
        console.log(product,'varuo');
        console.log(total,'varanm');
        return new Promise(async(resolve,reject)=>
        {
            let status=order.paymentmethod=='cod'?'placed':'pending'
            let orderObj={
                deliveryDetails:{
                    mobile:order.phoneno,
                    address:order.address,
                    pincode:order.pincode,
                    firstname:order.firstname,
                    lastname:order.lastname
                },
                paymentmethod:order.paymentmethod,
                
                userId:objectId(userId),
                products:product,
                totalAmount:total,
                status:status,
                date:new Date().toDateString()

            }
             await db.get().collection(collection.ORDERCOLLECTION).insertOne(orderObj).then((response)=>
             {
                 db.get().collection(collection.CARTCOLLECTION).deleteOne({user:objectId(userId)})
              resolve(response)
             })
        })
    },
    getproductList:(userId)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            let cart= await db.get().collection(collection.CARTCOLLECTION).findOne({user:objectId(userId)})
             
              resolve(cart.product)
             
        })
    },
    vieworders:(userid)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            let order=await db.get().collection(collection.ORDERCOLLECTION).find({userId:objectId(userid)}).toArray()
            
            resolve(order)
        })
        
           
    
    
    },
    vieworderedproducts:(orderid)=>
    { 
        return new Promise(async(resolve,reject)=>
        {
            let orderItems=await db.get().collection(collection.ORDERCOLLECTION).aggregate([
                {
                    $match:{_id:objectId(orderid)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCTCOLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'products'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$products',0]}
                    }
                },
             
                
           
            ]).toArray()
           
                resolve(orderItems)
            
           
            })
    
    },
    cancelOrderlist:(data)=>
    {
        return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(collection.ORDERCOLLECTION).updateOne({_id:objectId(data.orders)},{
                $set:{
                       status:'cancelled'
                }
            }).then((response)=>
            {
                resolve({cancelItem:true})
            })
        })
    },
    otppasscheck:(data)=>
    {
        
 
    
    let mob=data.contactNo;
 
   return new Promise(async(resolve,reject)=>
   {
    
     let validNo =  await db.get().collection(collection.USERCOLLECTION).findOne({contactNo:data.contactNo})
     if(validNo)
     
   {  
     
     client.verify.services(verifySid).verifications.create({to:`+91${data.contactNo}`,channel:'sms'})
        .then((response)=>{
            response.status=true
            response.user=validNo
        resolve(response)
        })
   }
   else
        {
           
           resolve({status:false})
        }
})
 },
 vlidchck:(data,contactNo)=>
 {
    

        const otp=data.otp
            return new Promise(async (resolve,reject)=>
            {
            await client.verify.services(verifySid).verificationChecks.create({to:`+91${contactNo}`,code:otp}).then((verification_check)=>
               {
                
                resolve(verification_check)
            
                
                
            })
        })
        
         
 },
 retypepass:(data,contactNoo)=>
 { console.log(contactNoo,'vvv');
    console.log(data.newpassword,'kk');
    return new Promise(async(resolve,reject)=>
    {
      let newpassword=  await bcrypt.hash(data.newpassword,10)
      await db.get().collection(collection.USERCOLLECTION).updateOne({contactNo:contactNoo},
        {
            $set:{
                password:newpassword
            }
        }).then((response)=>
        {
            console.log(response);
        resolve(response)
        })
    })
 },
 editAccount:(req,res,next)=>
 {
    return new Promise(async(resolve,reject)=>
    {

    await db.get().collection(collection.USERCOLLECTION).findOne({_id:objectId(userid)}).then((users)=>
    {
     resolve(users)
    })
})

 }
    }

    








