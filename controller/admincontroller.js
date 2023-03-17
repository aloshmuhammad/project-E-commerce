const layout='./admin/adminlayout'
var adminHelper=require('../Model/helpers/Adminhelpers')
const {adminLOgin,getAllUsers,blockUser,unblockUser,adminAddcat,getAllCategory,deleteCategory,getCategory,editcategoryp,addproduct,getAllproducts,deleteProducts,getproducts,editproductPost,getOrders,getOrdersad,vieworderedproducts,statusPin,adminSalesGraph,downloadReport, CouponAd,getAllCoupons,deleteCoupons}=adminHelper

module.exports=
{
    homePage:(req,res,next)=>
    { 
        try{
        res.render('admin/adsignin',{layout})
        }
        catch(error)
        {
            res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
        }
       
    },
    adDash:(req,res,next)=>
    {
        try{
            if(req.session.loggedInad)
            {
                adminSalesGraph().then((Data)=>
                { console.log(Data.DeliveredCount,'ljh');
                
                
                    res.render('admin/indexad',{layout,adin:true,Data})
                })    
        
            }
            else{
                res.redirect('/admin')
            }
        }
        catch(error)
        {
            res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
        }
     
    },
    adsigninPost:(req,res,next)=>
    {
        try{
            adminLOgin(req.body).then((response)=>
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
            }).catch(error=>{
                console.log(error,"sadf")
                res.status(500).send(error.message)
              })
        }
        catch(error)
        {
            res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
        }
      
    },
    viewUsers:(req,res,next)=>
{
    try{
        if(req.session.loggedInad){
            getAllUsers().then((users)=>
        {
        
      res.render('admin/viewusers',{layout,adin:true,users});
        }).catch(error=>{
            console.log(error,"sadf")
            res.status(500).send(error.message)
          })
            
        }
        else{
            res.redirect('/admin')
        }
    }
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }
 
    

},

blockUser:(req,res,next)=>
{
    try{
        if(req.session.loggedInad)
        {
        let userid=req.params.id
        console.log(userid);
        blockUser(userid).then((response)=>
        {
        
            res.redirect('/admin/viewusers')
        
        }).catch(error=>{
            console.log(error,"sadf")
            res.status(500).send(error.message)
          })
    }
    else{
        res.redirect('/admin')
    }
    }
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }

},
unblockUser:(req,res,next)=>
{
    
    try{
        let userid=req.params.id
        console.log(userid);
        unblockUser(userid).then((response)=>
        {
        
            res.redirect('/admin/viewusers')
        
        }). catch(error=>{
            console.log(error,"sadf")
            res.status(500).send(error.message)
          })
    }
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }
    
    
 
},
category:(req,res,next)=>
{
    try{
        res.render('admin/add-category',{layout,adin:true})
    
    }
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }
    
    
    
    
},
addCategory:(req,res,next)=>
{
    try {
        adminAddcat(req.body).then((category)=>
        {
        let oldcat = category.status
        if(oldcat)
        { 
            res.render('admin/view-category',{layout,olduser,adminin:true})
        
        }
        else{
            res.redirect('/admin/view-category')
        
        }
        }).catch(error=>{
            console.log(error,"sadf")
            res.status(500).send(error.message)
          })
          
    } 
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }
    



},
viewCategory:(req,res,next)=>
{
    try{
        getAllCategory().then((categories)=>
        {
        
      res.render('admin/view-category',{layout,adin:true,categories});
        })
            
    }
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }
    
    
        
    
   
    

},
deleteCategory:(req,res,next)=>
{
    
    try{
        let userid=req.params.id
        console.log(userid);
        deleteCategory(userid).then((response)=>
        {
        
            res.redirect('/admin/view-category')
        
        })
    }
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }
    
  

},
editCategory:(req,res,next)=>
{
    let userid=req.params.id
    try{
        getCategory(userid).then((category)=>
        {
    res.render('admin/edit-category',{layout,adin:true,category})
    
    })
    }
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }
    


    },
 editcategoryPost:(req,res,next)=>
 {
    console.log(req.body);
    try
    {
   
        editcategoryp(req.body).then((response)=>
        {
            res.redirect('/admin/view-category')
    
        })
    }
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }

 
 }   ,
 addProduct:(req,res,next)=>
 {
    try{
        getAllCategory().then((categories)=>
        {
    res.render('admin/add-product',{layout,adin:true,categories})
    })
    }
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }

  

 },
 addproductPost:(req,res,next)=>

 { 
    try
    {
        const files=req.files
    const filename=files.map((file)=>
    {
        return file.filename
    })
    const product =req.body
    product.productImage = filename


    addproduct(req.body).then((response)=>
    {    
        
        const files=req.files
        let proImage=product.productImage;
        
        
        res.redirect('/admin/add-product')
    })
}
catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }

 },
 viewProducts:(req,res,next)=>
 {  
    try{
        getAllproducts().then((products)=>
        {  
            // console.log(products[0]);
           // products.forEach(element => {
            
           // });
              res.render('admin/product-list',{layout,adin:true,products})
        })
    }
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }

       
  
  
    
    
 },
 deleteProduct:(req,res,next)=>
 {
 try{
    let productid=req.params.id
    console.log(productid);
    deleteProducts(productid).then((response)=>
    {
    
        res.redirect('/admin/view-products')
    
    })
 }
 catch(error)
 {
     res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
 }

    
   

 },
 editProducts:(req,res,next)=>
 { 
    try{
    let productid=req.params.id
    
    getproducts(productid).then((products)=>
    {
        getAllCategory().then((categories)=>
        {
            res.render('admin/edit-product',{layout,adin:true,products,categories})
        })

        
        
    })
 }
 catch(error)
 {
     res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
 }


   


 
 },
 editProductpost:(req,res,next)=>
 {
    console.log(req.files,'file')
    console.log(req.body,'body');
try{
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


    editproductPost(data,images).then((response)=>
    {
       
    res.redirect('/admin/view-products')
    })
}
catch(error)
 {
     res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
 }

 
 },
 LogOut:(req,res,next)=>
 {
    try{
        req.session.loggedInad=false
        req.session.admin=null
    //req.session.destroy();
    res.redirect('/admin');
    }
    catch(error)
 {
     res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
 }

 
},
viewOrders:async(req,res,next)=>
{
try{
    let orders=await getOrders()
    res.render('admin/orderlist',{layout,adin:true,orders})
}
catch(error)
{
    res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
}


    
},
orderDetail:async(req,res,next)=>
{
    try{
        let orders=await getOrdersad(req.params.id)
        let orderedproducts= await vieworderedproducts(req.params.id)
        res.render('admin/orderdetail',{layout,adin:true,orderedproducts,orders})
    }
    catch(error)
{
    res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
}

   
},
statusChange:(req,res,next)=>
{
    console.log(req.body,'hbhb');
try
{
    statusPin(req.body).then((response)=>
    {
        res.json(response)
    })
}
catch(error)
{
    res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
}


    
},
downloadReport:async(req,res,next)=>
{
try{
    let Orders= await downloadReport()
    let Data= await adminSalesGraph()

        console.log(Orders,'ev');
        res.render('admin/sales-report',{layout,adin:true,Orders,Data})

    
}
catch(error)
{
    res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
}
},
AddCoupon:(req,res,next)=>
{
try
{
    res.render('admin/coupon-manage',{layout,adin:true,})
}
catch(error)
{
    res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
}

},
addNewcpn:(req,res,next)=>
{
    console.log(req.body,'asdf');
    try
    {
        CouponAd(req.body).then((response)=>
        {
            res.render('admin/coupon-manage',{layout,adin:true,cpn:true})
        })
    }
    catch(error)
{
    res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
}



  
   
},
couponView:async(req,res,next)=>
{
    try
    {
       let Coupons= await getAllCoupons()
       console.log(Coupons,'cpn');
    res.render('admin/view-coupon',{layout,adin:true,Coupons})
    }
    catch(error)
    {
        res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
    }

},
DeleteCoupon:(req,res,next)=>
{
    let Id=req.query.id
    console.log(Id,'fck');
    deleteCoupons(Id).then((response)=>
    {
        res.redirect('/admin/view-coupons')
    })
}

 
}
