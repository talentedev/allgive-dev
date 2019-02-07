const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const firebase = require('firebase');
const stripe = require('stripe')('sk_test_LVx3d8fWhuQl1YCV3BnfWzP4');

const app = express();

// Initialize Firebase
let fbConfig = {
    apiKey: "AIzaSyBtjCJVVC4Rf0T1jVOJPbxxR0DUSAL_AWA",
    authDomain: "allgive-app-25240.firebaseapp.com",
    databaseURL: "https://allgive-app-25240.firebaseio.com",
    projectId: "allgive-app-25240",
    storageBucket: "allgive-app-25240.appspot.com",
    messagingSenderId: "856416375337"
};
firebase.initializeApp(fbConfig);

let database = firebase.database();

// Set CORS middleware : Uncomment for production
let corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handlers
app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
        'errors': {
            message: err.message,
            error: err
        }
    });
});

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/index.html'));
});

// Create a new Stripe customer
app.post('/users', function(req, res) {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const authId = req.body.authId;

    stripe.customers.list(
        { email: email },
        function(err, customers) {
            let customerId = '';
            if (customers && customers.data.length > 0) {
                database.ref('users/' + authId).set({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    customerId: customers.data[0].id
                }, function(snapshot) {
                    res.send(snapshot);
                });
            } else {
                stripe.customers.create({
                    email: email
                }, function(err, customer) {
                    database.ref('users/' + authId).set({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        customerId: customer.id
                    }, function(snapshot) {
                        res.send(snapshot);
                    });
                });
            }
        }
    );
});

//Create new Stripe subscription
app.post('/subscription', function(req, res) {
    const charity = req.body.charity;
    const donationAmount = req.body.donation;
    const donationFrequency = req.body.frequency;
    const authUser = req.body.user;
    const token = req.body.token;

    // Create a new Stripe plan and product
    getUser(authUser.uid).then(snapshot => {
        let user = snapshot.val();
        updateCustomer(user.customerId, {source: token}).then(customer => {
            stripe.plans.create({
                currency: 'usd',
                amount: donationAmount,
                interval: donationFrequency,
                product: {
                    name: charity.fields.charityName,
                    type: 'service',
                    statement_descriptor: `Donation subscription`
                }
            }, function(err, plan) {
                if (err) {
                    res.send(err);
                }
                stripe.subscriptions.create({
                    customer: user.customerId,
                    items: [
                        {
                            plan: plan.id,
                        }
                    ]
                }, function(err, subscription) {
                    if (err) {
                        res.send(err);
                    }
                    res.send(subscription);
                });
            });
        });
    });
});

function updateCustomer(id, data) {
    return stripe.customers.update(id, data);
}

function getUser(id) {
    return database.ref('/users/' + id).once('value');
}

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
