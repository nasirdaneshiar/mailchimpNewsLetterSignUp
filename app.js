require('dotenv').config();
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express(); 

// body parser midleware
app.use(bodyParser.urlencoded({extended: true}));

// Static folder
app.use(express.static(path.join(__dirname,'public')))

const port = process.env.PORT || 3001;

app.listen(port , console.log(`Server started on ${port}`));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
})

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.post("/", (req,res)=>{
    const {fristname, lastname, email } = req.body;

    //Construct req data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields:{
                    FNAME: fristname,
                    LNAME: lastname
                }

            }
        ]
    };

    const postData = JSON.stringify(data);

    const options = {
        url:'https://us21.api.mailchimp.com/3.0/lists/f07e2eb7ea',
        method: 'POST',
        headers: {
            Authorization: process.env.Auth
        },
        body: postData
    }
    request(options, (err, response, body)=>{
        if(err){
            console.log('hi1:');
            console.log(err);
            res.redirect('/failure.html');
        } else {
            if (response.statusCode === 200) {
                res.redirect('/success.html'); 
            }else{
                console.log('hi2:');
                console.log(response.statusCode);
                console.log("#######");
                
                res.redirect('/failure.html');
            }

        }
    }) 
    
});