const layout='./admin/adminlayout'
const { response } = require('express')
var adminHelper=require('../helpers/Adminhelpers')


module.exports=
{
    homepage:(req,res,next)=>
    {
        res.render('admin/adsignin',{layout})
    },
    addash:(req,res,next)=>
    {
        if(req.session.loggedInad)
        {
     res.render('admin/indexad',{layout,adin:true})
        }
        else{
            res.redirect('/admin')
        }
    },
    adsigninpost:(req,res,next)=>
    {
        adminHelper.adminLOgin(req.body).then((response)=>
        {  
            let admina=response.status;
        
            if(admina)
            {   req.session.loggedInad=true
                req.session.admin=response.validadmin
                res.redirect('/admin/dashboard')
    
            }
            else{
                res.redirect('/admin')
            }
        })
    },
    viewUsers:(req,res,next)=>
{
    if(req.session.loggedInad){
        adminHelper.getAllUsers().then((users)=>
    {
    
  res.render('admin/viewusers',{layout,adin:true,users});
    })
        
    }
    else{
        res.redirect('/admin')
    }
    

},

BlockUser:(req,res,next)=>
{
    
    if(req.session.loggedInad)
    {
    let userid=req.params.id
    console.log(userid);
    adminHelper.blockUser(userid).then((response)=>
    {
    
        res.redirect('/admin/viewusers')
    
    })
}
else{
    res.redirect('/admin')
}
},
UnblockUser:(req,res,next)=>
{
    
    if(req.session.loggedInad)
    {
    let userid=req.params.id
    console.log(userid);
    adminHelper.unblockUser(userid).then((response)=>
    {
    
        res.redirect('/admin/viewusers')
    
    })
}
else{
    res.redirect('/admin')
}
},
category:(req,res,next)=>
{
    if(req.session.loggedInad)
    {
    res.render('admin/add-category',{layout,adin:true})
    }
    else{
        res.redirect('/admin')
    }
},
Addcategory:(req,res,next)=>
{

    adminHelper.adminAddcat(req.body).then((category)=>
    {
    let oldcat = category.status
    if(oldcat)
    { 
        res.render('admin/view-category',{layout,olduser,adminin:true})
    
    }
    else{
        res.redirect('/admin/view-category')
    
    }
    })
    
},
viewCategory:(req,res,next)=>
{
    if(req.session.loggedInad){
        adminHelper.getAllCategory().then((categories)=>
    {
    
  res.render('admin/view-category',{layout,adin:true,categories});
    })
        
    }
    else{
        res.redirect('/admin')
    }
    

},
DeleteCategory:(req,res,next)=>
{
    
    if(req.session.loggedInad)
    {
    let userid=req.params.id
    console.log(userid);
    adminHelper.deleteCategory(userid).then((response)=>
    {
    
        res.redirect('/admin/view-category')
    
    })
}
},
Editcategory:(req,res,next)=>
{
    let userid=req.params.id
    adminHelper.getCategory(userid).then((category)=>
    {
res.render('admin/edit-category',{layout,adin:true,category})

})
    },
 Editcategorypost:(req,res,next)=>
 {
    console.log(req.body);
    
    
    adminHelper.editcategoryp(req.body).then((response)=>
    {
        res.redirect('/admin/view-category')

    })
 }   ,
 AddProduct:(req,res,next)=>
 {if(req.session.loggedInad)
    {
        adminHelper.getAllCategory().then((categories)=>
        {
    res.render('admin/add-product',{layout,adin:true,categories})
    })
}
    else{
        res.redirect('/admin')
    }
 },
 AddProductpost:(req,res,next)=>

 { const files=req.files
    const filename=files.map((file)=>
    {
        return file.filename
    })
    const product =req.body
    product.productImage = filename


    adminHelper.addproduct(req.body).then((response)=>
    {    
        
        const files=req.files
        let proImage=product.productImage;
        
        
        res.redirect('/admin/add-product')
    })
 },
 viewProducts:(req,res,next)=>
 {  
    if(req.session.loggedInad)
    { 
        adminHelper.getAllproducts().then((products)=>
        {  
            // console.log(products[0]);
           // products.forEach(element => {
            
           // });
              res.render('admin/product-list',{layout,adin:true,products})
        })
  
    }
    else
    {
        res.redirect('/admin')
    }
    
 },
 deleteProduct:(req,res,next)=>
 {
 
    if(req.session.loggedInad)
    {
    let productid=req.params.id
    console.log(productid);
    adminHelper.deleteProducts(productid).then((response)=>
    {
    
        res.redirect('/admin/view-products')
    
    })
}
 },
 editProducts:(req,res,next)=>
 { let productid=req.params.id
    if(req.session.loggedInad)
    {
    adminHelper.getproducts(productid).then((products)=>
    {
        adminHelper.getAllCategory().then((categories)=>
        {
            res.render('admin/edit-product',{layout,adin:true,products,categories})
        })

        
        
    })
}
else{
    res.redirect('/admin')
}
 
 },
 editProductpost:(req,res,next)=>
 {
    console.log(req.files,'file')
    console.log(req.body,'body');

    let data =req.body
    let images=req.files
    // let img0 =""
    // let img1=""
    // let img2=""
    // let img3=""
    
    
    // req.files.img1?img1=req.files.img1[0].filename:
    // req.files.img2?img2=req.files.img2[0].filename:
    // req.files.img0?img3=req.files.img3[0].filename:
    // data={
    //     title:req.body.title,
    //     color:data.color,
    //     size:data.size,
    //     brand:data.brand,
    //     price:data.price,
    //     description:data.description,
    //     category:data.category,
    //     stock:data.stock,
    //     productImage:[img0,img1.img2,img3]
        
    // }


    adminHelper.editproductPost(data,images).then((response)=>
    {
       
    res.redirect('/admin/view-products')
    })
 },
 Logout:(req,res,next)=>
 {
    req.session.loggedInad=false
    req.session.admin=null
//req.session.destroy();
res.redirect('/admin');
},
viewOrders:async(req,res,next)=>
{

    let orders=await adminHelper.getOrders()
    res.render('admin/orderlist',{layout,adin:true,orders})
},
orderDetail:async(req,res,next)=>
{
    let orders=await adminHelper.getOrdersad(req.params.id)
    let orderedproducts=await adminHelper.vieworderedproducts(req.params.id)
    res.render('admin/orderdetail',{layout,adin:true,orderedproducts,orders})
},
statusChange:(req,res,next)=>
{console.log(req.body,'hbhb');
    adminHelper.statusPin(req.body).then((response)=>
    {
        res.json(response)
    })
}

 
}
