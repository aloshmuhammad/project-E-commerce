var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { LongWithoutOverridesClass } = require('bson')
const {resolve, reject}= require('promise')
var objectId=require('mongodb').ObjectId

module.exports={
adminLOgin:(data)=>
{ 
     return new Promise(async(resolve,reject)=>
    {   let response={}
        let validadmin= await db.get().collection(collection.ADMINCOLLECTION).findOne({email:data.email,password:data.password})
        if(validadmin)
        {    console.log("login sucess")
            response.validadmin=validadmin
            response.status=true
            resolve(response)
            
        }
        else{
            console.log("loginfailed")
            response.status=false
            resolve(response)
        }
    
    })

},

getAllUsers:()=>
{
    return new Promise(async(resolve,reject)=>
    {
      let users= await db.get().collection(collection.USERCOLLECTION).find().toArray()
      resolve(users)
    })
},

blockUser:(userid)=>
{
    return new Promise(async(resolve,reject)=>
    {
        console.log(userid)
        await db.get().collection(collection.USERCOLLECTION).updateOne({_id:objectId(userid)},
        {$set:{
            status:false}}).then((response)=>
        {
            console.log(response);
        resolve()
        })
    })
},
unblockUser:(userid)=>
{
    return new Promise(async(resolve,reject)=>
    {
        console.log(userid)
        await db.get().collection(collection.USERCOLLECTION).updateOne({_id:objectId(userid)},
        {$set:{
            status:true}}).then((response)=>
        {
            console.log(response);
        resolve()
        })
    })
},
adminAddcat:(category)=>

{  
    return new Promise(async(resolve,reject)=>
    {   let oldcat={}
        let repeatcat=await db.get().collection(collection.CATEGORYCOLLECTION).findOne({name:category.name})
        if(repeatcat)
        {
            oldcat.status=true
         resolve(oldcat)           
        }
        else{
        
        db.get().collection(collection.CATEGORYCOLLECTION).insertOne(category)
        resolve({status:false})
        }
    })
},
getAllCategory:()=>
{
    return new Promise(async(resolve,reject)=>
    {
      let categories= await db.get().collection(collection.CATEGORYCOLLECTION).find().toArray()
      resolve(categories)
    })
},
deleteCategory:(userid)=>
 {
    return new Promise(async(resolve,reject)=>
    {
    
        await db.get().collection(collection.CATEGORYCOLLECTION).deleteOne({_id:objectId(userid)}).then((response)=>
        {
            
        resolve(response)
        })
    })
},
getCategory:(userid)=>
    {
    return new Promise(async(resolve,reject)=>
    {

    await db.get().collection(collection.CATEGORYCOLLECTION).findOne({_id:objectId(userid)}).then((users)=>
    {
     resolve(users)
    })
})

},
editcategoryp:(data)=>
{ 
    console.log(data);
    return new Promise(async(resolve,reject)=>
    {
     await db.get().collection(collection.CATEGORYCOLLECTION).updateOne({_id:objectId(data.id)},
     {$set:
        {
            name:data.name,
            Description:data.Description
        }
    }).then((response)=>
    {
        resolve(response)
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
addproduct:(data)=>
{   
    return new Promise(async(resolve,reject)=>
    {
        await db.get().collection(collection.PRODUCTCOLLECTION).insertOne(data).then((response)=>
        {
            resolve(response)
        })
    })
},
deleteProducts:(productid)=>
{
    return new Promise(async(resolve,reject)=>
    {
        await db.get().collection(collection.PRODUCTCOLLECTION).deleteOne({_id:objectId(productid)}).then((response)=>
        {
            
        resolve(response)
        })
    })

},
getproducts:(productid)=>
    {
    return new Promise(async(resolve,reject)=>
    {

    await db.get().collection(collection.PRODUCTCOLLECTION).findOne({_id:objectId(productid)}).then((product)=>
    {
     resolve(product)
    })
})


},
editproductPost:(data,images)=>
{
    
    return new Promise(async(resolve,reject)=>
    { 
        let product=await db.get().collection(collection.PRODUCTCOLLECTION).findOne({_id:objectId(data.id)})
    if(images.img0)
    {
        product.productImage[0]=images.img0[0].filename
    }
    if(images.img1)
    {
        product.productImage[1]=images.img1[0].filename
    }
    if(images.img2)
    {
        product.productImage[2]=images.img2[0].filename
    }
    if(images.img3)
    {
        product.productImage[3]=images.img3[0].filename
    }
      
      
      
           
            

        await db.get().collection(collection.PRODUCTCOLLECTION).updateOne({_id:objectId(data.id)},{$set:
            { 
                title:data.title,
                color:data.color,
                size:data.size,
                brand:data.brand,
                price:data.price,
                description:data.description,
                category:data.category,
                stock:data.stock,
                productImage:product.productImage


            }}).then((response)=>
            {
                resolve(response)
            })

        
    
    })
   
},
getOrders:()=>
{
    return new Promise(async(resolve,reject)=>
    {
        let Orders=await db.get().collection(collection.ORDERCOLLECTION).find().toArray()
        
            
         resolve(Orders)
        
    })
},
vieworderedproducts:(orderid)=>
{ 

    
        return new Promise(async(resolve,reject)=>
        {
            let adminorderItems=await db.get().collection(collection.ORDERCOLLECTION).aggregate([
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
           console.log(adminorderItems,'bbbb');
                resolve(adminorderItems)
            
           
            }) 
        
       
    

        
},
getOrdersad:(orderid)=>
{
    return new Promise(async(resolve,reject)=>
    {
        let Orders=await db.get().collection(collection.ORDERCOLLECTION).findOne({_id:objectId(orderid)})
        
            
         resolve(Orders)
        
    })
},
statusPin:(data)=>
{ 
let orderid=data.orderid
console.log(orderid,'cv');
console.log(data,'data');

    
    return new Promise(async(resolve,reject)=>
        {
            await db.get().collection(collection.ORDERCOLLECTION).updateOne({_id:objectId(orderid)},{
                $set:{
                       status:data.status
                }
            }).then((response)=>
            {
                resolve({status:true})
            })
        })
}

}

