const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const firebase = require('firebase');
const stripe = require('stripe')('sk_test_n6hT27LlycvlGLYo2hiWIzi0');

const app = express();

//
// Set CORS middleware
// Uncomment for production
//

let corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

//
// Set up server
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let server = app.listen(3000, function () {
    console.log('Listening on port %s', server.address().port);
});

//
// Initialize Firebase
//
let fbConfig = {
    apiKey: "AIzaSyDoFmIQ91-j40s2skTZDhFCmsKEXoYv10M",
    authDomain: "allgive-db679.firebaseapp.com",
    databaseURL: "https://allgive-db679.firebaseio.com",
    projectId: "allgive-db679",
    storageBucket: "allgive-db679.appspot.com",
    messagingSenderId: "856416375337"
};
firebase.initializeApp(fbConfig);

let database = firebase.database();

//
// Error handlers
//
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

//
// Helper functions
//

// Get Firebase DB user Id
function getUser(authId) {
    const usersRef = database.ref('users');
    return usersRef.orderByChild('authId').equalTo(authId.uid).on('value', function(snapshot) {
        return snapshot;
    });
}

// Check if product exists for charity
function checkForCharity(charity, amount, frequency) {
    const productRef = database.ref('products');
    const plansRef = database.ref('plans');

    return productRef.orderByChild('name').equalTo(charity.charityName).on('value', function(snapshot) {
        if (!snapshot) {
            // Add product to DB if it does not exist
            return productRef.push({
                productName: charity.charityName,
            })
            .then(function(newProductRef) {
                // Create a new Stripe plan and product
                stripe.plans.create({
                    currency: 'usd',
                    amount: amount,
                    interval: frequency,
                    product: {
                        name: charity.charityName,
                        type: 'service',
                        statement_descriptor: `Donation subscription to ${charity.charityName}`
                    }
                }, function(err, plan) {
                    if (err) {
                        return console.log(err);
                    }

                    // Write new Stripe product to Firebase DB
                    productRef.push({
                        stripeProductId: plan.product,
                    })
                    .then(function(newStripeProduct) {
                        // Write new Stripe plan to Firebase DB
                        return plansRef.push({
                            stripePlanId: plan.id,
                            amount: plan.amount,
                            interval: plan.interval,
                            stripeProductId: plan.product,
                            productId: newStripeProduct.id
                        })
                        .then(function(newPlanRef) {
                            return newPlanRef.stripePlanId;
                        });
                    });

                    return plan;
                });
            });
        }

        return plansRef.orderByChild('product').equalTo(snapshot.stripeProductId).on('value', function(snapshot) {
            return stripe.plans.retrieve(snapshot.stripePlanId, function(err, plan) {
                if (err) {
                    return console.log(err);
                }
    
                return plan;
            });
        });
    });
}

// Check if Stripe subscription exists
function checkForSubscription(authId, plan) {
    const subscriptionRef = database.ref('subscriptions');
    const user = getUser(authId);
    const userRef = database.ref(`users/${user.id}/subscriptions`);

    return subscriptionRef.orderByChild('plan').equalTo(plan.id).on('value', function(snapshot) {
        if (!snapshot) {
            return stripe.subscriptions.create({
                customer: user.customerId,
                items: [
                    {
                        plan: plan.id,
                    }
                ]
            }, function(err, subscription) {
                if (err) {
                    return console.log(err);
                }

                let newSubscriptionRef = subscriptionRef.push({
                    stripeSubscriptionId: subscription.id,
                    user: user,
                    plan: plan.id
                });

                userRef.push({
                    subscriptionId: newSubscriptionRef.id,
                    stripeSubscriptionId: subscription.id
                })
                .then(function() {
                    return subscription;
                });
            });
        }

        return stripe.subscriptions.retrieve(snapshot.stripeSubscriptionId);
    });

    
}

//
// Endpoints
//

// Create an individual charge
app.post('/charge', function (req, res) {
    const token = req.body.token;
    const donation = req.body.donation;

    stripe.charges.create({
        amount: donation,
        currency: 'usd',
        description: 'Test Charge',
        source: token
    }, function(err, charge) {
        res.send(charge);
    });
});

//Create new Stripe subscription
app.post('/subscription', function(req, res) {
    const charity = req.body.charity;
    const donationAmount = req.body.donation;
    const donationFrequency = req.body.frequency;
    const user = req.body.user;

    // Check if charity exists on DB, if not, create it
    let plan = checkForCharity(charity, donationAmount, donationFrequency);

    return checkForSubscription(user, plan);
});

// Create a new Stripe customer
app.post('/customer', function(req, res) {
    const email = req.body.email;

    stripe.customers.list(
        { email: email },
        function(err, customers) {
            if (customers.length > 0) {
                return res.send('Customer with this email already exists');
            }

            return stripe.customers.create({
                email: email
            }, function(err, customer) {
                res.send(customer);
            });
        }
    )

    
});

// Retrieve existing Stripe customer
app.get('/customer', function(req, res) {
    
});

// Update existing Stripe customer
// app.update('/customer', function(req, res) {

// });

module.exports = app;