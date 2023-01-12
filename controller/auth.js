module.exports=
{
    verifyadmin:(req,res,next)=>
    {
        if(req.session.loggedInad)
        {
            next()
        }
        else
        {
            res.redirect('/admin')
        }

    },
    verifyuser:(req,res,next)=>
    {
        if(req.session.loggedIn)
        {
            next()
        }
        else{
            res.redirect('/')
        }
    }
}