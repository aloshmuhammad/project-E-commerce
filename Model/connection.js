const  MongoClient  = require("mongodb").MongoClient;
const state={
    db:null
}
module.exports.connect=function (done) 
{
    const url="mongodb+srv://Aloshm:ZKDU0e9TpbMISH0u@cluster0.oh3zhpk.mongodb.net/?retryWrites=true&w=majority";
    const dbname='Projectmain'
    MongoClient.connect(url,{ useNewUrlParser: true,useUnifiedTopology:true},(err,data)=>
    {
        if(err)
        {   
            
            return done(err)
        }
        else{
            
            state.db=data.db(dbname)
        }
    })
done()
}
module.exports.get=function()
{
    return state.db
}
    

