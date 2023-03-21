
function addtoCart(proId)
{
    $.ajax({
        url:'/addto-cart/' + proId,
        method:'get',
        success:(response)=>
        {                
       
            if(response.status)
            {
                Toastify({
                    text: "Item added To Cart",
                    duration: 3000,
                    gravity: "bottom",
                    position: "center",  
                    style: {
                        background: '#FA8072',
                       
                    },
                }).showToast();
                let count = $('#cart-countId').html()
                count=parseInt(count)+1
                $('#cart-countId').html(count)
                
            }
            
        }
    })
}

function addtoWish(proId)
{
    $.ajax({
        url:'/addtoWishlist',
        
        data:{
            ProductId:proId
        },
        method:'post',
        success:(response)=>
        {                
       
            if(response.status)
            {
                Toastify({
                    text: "Item added To WishList",
                    duration: 3000,
                    gravity: "bottom",
                    position: "center",  
                    style: {
                        background: '#FA8072',
                       
                    },
                }).showToast();
                
            }
            
        }
    })
}








