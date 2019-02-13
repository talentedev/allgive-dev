const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const firebase = require('firebase');
const stripe = require('stripe')('sk_test_LVx3d8fWhuQl1YCV3BnfWzP4');

const fbConfig = require('./firebase.json');

const app = express();

// Initialize Firebase
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
app.use('/', express.static(__dirname + '/dist'));

app.get('*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/index.html'));
});

// Check if user is registered on database
app.post('/check-user', function(req, res) {
    const email = req.body.email;
    database.ref('users').orderByChild("email").equalTo(email).on("value", function(snapshot) {
        if (snapshot.val()) {
            res.send(snapshot.val());
        } else {
            res.send(null);
        }
    });
});

// Get user's general informations
app.post('/getUserInfo', function(req, res) {
    const userId = req.body.uid;
    getUser(userId).then(user => {
        let userData = user.val();
        stripe.subscriptions.list(
            { 
                customer: userData.customerId,
                billing: "charge_automatically"
            },
            function(err, subscriptions) {
                let contributions = [];
                let productIds = [];
                let getInvoicesPromises = [];
                let getProductPromises = [];
                for (var i = 0; i < subscriptions.data.length; i++) {
                    getInvoicesPromises.push(getInvoices(subscriptions.data[i].id, userData.customerId));
                    getProductPromises.push(getProduct(subscriptions.data[i].plan.product));
                }
                Promise.all(getProductPromises)
                    .then((products) => {
                        for (var i = 0; i < products.length; i++) {
                            let product = {
                                charityname: products[i].name
                            }
                            contributions.push(product);
                        }
                        Promise.all(getInvoicesPromises)
                            .then((invoices) => {
                                for (var i = 0; i < invoices.length; i++) {
                                    let totalAmount = 0;
                                    for (var j = 0; j < invoices[i].data.length; j++) {
                                        totalAmount += invoices[i].data[j].total;
                                    }
                                    contributions[i]['ytd'] = totalAmount/100;
                                    contributions[i]['amount'] =  invoices[i].data[0].amount_paid/100;
                                    contributions[i]['schedule'] = subscriptions.data[i].plan.interval;
                                    contributions[i]['projection'] = calcYearProjection(contributions[i]);
                                }
                                userData.contributions = contributions;
                                res.send(userData);
                            })
                            .catch(err => res.send(err));
                    })
                    .catch(err => res.send(err));
            }
        );
    });
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
        // Update customer and create subcription
        updateCards(user.customerId, token).then(card => {
            // Check if same product exist already
            stripe.products.list(
                { limit: 100 },
                function(err, products) {
                    let existProduct = getProductByName(products.data, charity.fields.charityName);
                    if (!existProduct) {
                        stripe.plans.create({
                            currency: 'usd',
                            amount: donationAmount,
                            interval: donationFrequency,
                            product:  {
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
                    } else {
                        product = existProduct.id;
                        // Check if same price plan exist on same product.
                        stripe.plans.list(
                            { product: product, interval: donationFrequency },
                            function(err, plans) {
                                if (plans.data.length > 0) {
                                    stripe.subscriptions.create({
                                        customer: user.customerId,
                                        items: [
                                            {
                                                plan: plans.data[0].id,
                                            }
                                        ]
                                    }, function(err, subscription) {
                                        if (err) {
                                            res.send(err);
                                        }
                                        res.send(subscription);
                                    });
                                } else {
                                    stripe.plans.create({
                                        currency: 'usd',
                                        amount: donationAmount,
                                        interval: donationFrequency,
                                        product:  product
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
                                }
                            }
                        );
                    }
                }
            );
        }).catch(function(err) {
            res.send(err);
        });
    });
});

// Get stripe card info
app.post('/user-cards', function(req, res) {
    const userId = req.body.uid;
    getUser(userId).then(snapshot => {
        let user = snapshot.val();
        stripe.customers.listCards(user.customerId, function(err, cards) {
            if (err) {
                res.send(err);
            }
            res.send(cards);
        });
    });
});

function updateCards(id, token) {
    return new Promise(function(resolve, reject) {
        stripe.customers.listCards(id, function(err, cards) {
            if (cards.data.length > 0) {
                for (var i = 0; i < cards.data.length; i++){
                    if (cards.data[i].id == token.source){
                        stripe.customers.updateCard(id, cards.data[i].id, token.card, function(err, card) {
                            if (err) {
                                reject(err);
                            }
                            resolve(card);
                        });
                    }
                }
                stripe.customers.createSource(id, {source: token.id}, function(err, card) {
                    if (err) {
                        reject(err);
                    }
                    resolve(card);
                });
            } else {
                stripe.customers.update(id, {source: token.id}, function(err, card) {
                    if (err) {
                        reject(err);
                    }
                    resolve(card);
                });
            }
        });
    });
}

function getUser(id) {
    return database.ref('/users/' + id).once('value');
}

// Check if some value exist on array of object.
function getProductByName(products, name) {
    for (var i = 0; i < products.length; i++){
        if (products[i].name == name){
            return products[i]
        }
    }
    return false;
}

// Get user's invoices for a subscription.
function getInvoices(subscriptionId, customerId) {
    return new Promise(function(resolve, reject) {
         stripe.invoices.list(
            { 
                customer: customerId,
                billing: "charge_automatically",
                paid: true,
                subscription: subscriptionId
            },
            function(err, invoices) {
                if (err) {
                    reject(err);
                }
                resolve(invoices);
            }
        );
    });
}

// Get a product by id.
function getProduct(productId) {
    return new Promise(function(resolve, reject) {
        stripe.products.retrieve(
            productId,
            function(err, product) {
                if (err) {
                    reject(err);
                }
                resolve(product);
            }
        );
    });
}

// Calculate the projection amount for a year
function calcYearProjection(data) {
    let projection = data.ytd;
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    const todayStr = mm + '/' + dd + '/' + yyyy;
    const endDate = '12/31/' + yyyy;

    const date1 = new Date(todayStr);
    const date2 = new Date(endDate);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const diffWeek = Math.ceil(diffDays / 7);
    const diffMonth = Math.ceil(diffDays / 30);
    const diffYear = Math.ceil(diffDays / 365);
    switch(data.schedule) {
        case "day": projection += data.amount * diffDays; break;
        case "week": projection += data.amount * diffWeek; break;
        case "month": projection += data.amount * diffMonth; break;
        case "year": projection += data.amount * diffYear; break;
    }
    return projection;
}

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
