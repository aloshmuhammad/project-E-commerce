function addtoCart(proId)
{
    $.ajax({
        url:'/addto-cart/' + proId,
        method:'get',
        success:(response)=>
        {                
       
            if(response.status)
            {
                let count = $('#cart-countId').html()
                count=parseInt(count)+1
                $('#cart-countId').html(count)
            }
            
        }
    })
}


