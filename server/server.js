const express = require('express'); //bring in express
const path = require('path');
const app = express(); //set up app
const fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));  // includes the body parse


let dataPath = path.join(__dirname, '../contacts/contacts.json');

// initial hard coded contacts

let validContacts = [
    
    {name: "Andrew", email: "lol@lol.com"},
    {name: "Luke", email: "lmao@lol.com" }
    
];

// ADVANCED 🚀🚀🚀

// Create /formsubmissions route >>> respond with results


app.get('/formsubmissions', (req,res) => { 
    
    fs.readFile(dataPath, (err,data) => { //reads contacts files
        
        // Read error handling
        if (err) {
            console.log({message: "there was an error reading the file. ", error: err});
            return;
        }
        
        console.log('Displaying contacts - ( route /formsubmissions )...');
       res.send(JSON.parse(data)); //parses data for display in JSON format
       

    })

});

// 3 - Create an express server that responds to the root get request ('/hello') with "Hello from the web server side...".
app.get('/hello', (req,res) => { 
    console.log('Hello from the web server side...');
    res.send('Hello from the web server side...');
});

// 4 - Use express.static to serve files from a folder named public in the root of your project.
app.use(express.static('public'));

// 5 - Create your own middleware using app.use that console.logs every req.url and passes flow to the next function

app.get('*', (req,res, next) => {

    let url = req.params;
    console.log(req.originalUrl);
    res.send(url);
    next()
})


// ADVANCED 🚀🚀🚀 -  Write file for every request POST Request - 


app.post('/formsubmit', (req,res, next) =>{
    const {name, email } = req.body

    // Error handling for falsey data
    if (!name || !email){
        res.send('❌ Please go back and enter valid info.');
        return;
    }


    if (name && email){ // Valid contact data

        res.send('✅ Thank you for submitting your info. Check out the "formsubmissions" route to see who is on the VIP list.'); // Opt in confirm


        // write to file if json is empty, adds validContacts  ---------------------

        if(!fs.existsSync(dataPath)){
            console.log('empty JSON! Here are some hardcoded contacts');
            fs.writeFile(dataPath, JSON.stringify(validContacts, null, 2), (err) => {
                
                if (err) {
                    console.log({message: "there was an error writing contacts to the file. ", error: err});
                    return;
                }
                
                console.log('Added in Contacts, see ../contacts/contacts.json');
            })
        }

        // READ contacts file ---------------------

        if(fs.existsSync(dataPath)){  // checks if contacts.json file exist

        fs.readFile(dataPath, (err,data) => {

            if (err) {
                console.log({message: "there was an error reading the file. ", error: err});
                return;
            }

            // Spread old data and adding new data
            let old_data = JSON.parse(data)  
            console.log(`old data = `);
            console.log(old_data);


            let new_data = {name, email}; //new contact data just added
            console.log(`new data = `);
            console.log(new_data);


            merged_data = [new_data, ...old_data]; // updating the array
            console.log(`merged data = `);
            console.log(merged_data);
            
            fs.writeFile(dataPath, JSON.stringify(merged_data,null, 2), (err) => {

                if (err) {
                    console.log({message: "there was an error writing NEW merged contacts to the file. ", error: err});
                    return;
                }
                console.log(`**** Merged Contacts, see ../contacts/contacts.json \n`);
    
            })

        })
    }
        
    
    }
    next();
});

app.listen(3000);
