const LoginService = require("../services/login-service");

module.exports = (app) => {
    
    const service = new LoginService();

    app.use('/app-events',async (req,res,next) => {

        const { payload } = req.body;
        console.log("============= Login... ================");
        
        console.log(payload);

         //handle subscribe events
        //  service.SubscribeEvents(payload);
         
       return res.status(200).json({message: 'notified!'});

    });

}
