var userHelper=require('../Model/helpers/Userhelpers');
module.exports=
{
    

    verifyAdmin:(req,res,next)=>
    {
        try
        {
            if(req.session.loggedInad)
            {
                next()
            }
            else
            {
                res.redirect('/admin')
            }
        }
        catch(error)
  {
      res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
  }
      

    },
    verifyUser:async (req,res,next)=>
    {
        try
        {
            if(req.session.loggedIn)
            {
                
                let user = await userHelper.getUSer(req.session.user._id)
                if(user.status){
                   
                  
                    next()
                  }
                else{

                    req.session.user=null
                   
                    req.session.loggedIn=false

                    res.redirect('/')
                }
              
            }
            else{
                res.redirect('/')
            }
        }
        catch(error)
  {
      res.render('error', { message: error.message, code: 500, layout: 'error-layout' });
  }

        }
        
}