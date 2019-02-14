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

/***************************************************************************
 *                                                                         *
 *     Check if user is registered on database                             *   
 *                                                                         *
 ***************************************************************************/
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

/***************************************************************************
 *                                                                         *
 *     Get user's general informations                                     *   
 *                                                                         *
 ***************************************************************************/
app.post('/getUserInfo', function(req, res) {
    const userId = req.body.uid;
    getUser(userId).then(user => {
        let userData = user.val();
        getCustomersByEmail(userData.email).then(customers => {
            let subscriptions = [];
            let cards = [];
            let collectUserInfoPromises = [];
            for (var i = 0; i < customers.data.length; i++) {
                collectUserInfoPromises.push(collectUserInfo(customers.data[i].subscriptions.data));
                Array.prototype.push.apply(cards, customers.data[i].sources.data);
            }
            userData.cards = cards;
            Promise.all(collectUserInfoPromises).then(datas => {
                let contributions = [];
                for (var i = 0; i < datas.length; i++) {
                    Array.prototype.push.apply(contributions, datas[i]);
                    userData.cards[i].charities = datas[i];
                }
                userData.contributions = contributions;
                res.send(userData);
            })
            .catch(err => res.send(err));
        })
        .catch(err => { res.send(err); });
    })
    .catch(err => res.send(err));
});

/***************************************************************************
 *                                                                         *
 *     Register new user.                                                  *   
 *                                                                         *
 ***************************************************************************/
app.post('/users', function(req, res) {
    const uid = req.body.uid;
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    database.ref('users/' + uid).set({
        email: email,
        firstName: firstName,
        lastName: lastName
    }, function(error) {
        if (error) res.send(error);
        res.send({result: 'success'});
    });
});

/***************************************************************************
 *                                                                         *
 *     Create new subscription for new customer                            *   
 *                                                                         *
 ***************************************************************************/
app.post('/new-subscription', function(req, res) {
    const charity = req.body.charity;
    const donationAmount = req.body.donation;
    const donationFrequency = req.body.frequency;
    const authUser = req.body.user;
    const token = req.body.token;

    createCustomer(authUser.email, token.id).then(customer => {
        getProductByName(charity.fields.charityName).then(product => {
            if (product) {
                getPlan(product.id, donationFrequency).then(plan => {
                    if (plan) {
                        createSubscription(customer.id, plan.id).then(subscription => {
                            res.send(subscription);
                        })
                        .catch(err => { res.send(err); });
                    } else {
                        createPlan(donationAmount, donationFrequency, product.id).then(newPricingPlan => {
                            createSubscription(customer.id, newPricingPlan.id).then(subscription => {
                                res.send(subscription);
                            })
                            .catch(err => { res.send(err); });
                        })
                        .catch(err => { res.send(err); });
                    }
                })
                .catch(err => { res.send(err); });
            } else {
                let newProduct = {
                    name: charity.fields.charityName,
                    type: 'service',
                    statement_descriptor: `Donation subscription`
                }
                createPlan(donationAmount, donationFrequency, newProduct).then(newPlan => {
                    createSubscription(customer.id, newPlan.id).then(subscription => {
                        res.send(subscription);
                    })
                    .catch(err => { res.send(err); });
                })
                .catch(err => { res.send(err); });
            }
        })
        .catch(err => { res.send(err); });
    })
    .catch(err => { res.send(err); });
});

/***************************************************************************
 *                                                                         *
 *     Create new subscription for existing customer                       *   
 *                                                                         *
 ***************************************************************************/
app.post('/subscription', function(req, res) {
    const charity = req.body.charity;
    const donationAmount = req.body.donation;
    const donationFrequency = req.body.frequency;
    const authUser = req.body.user;
    const customerId = req.body.customer;

    getProductByName(charity.fields.charityName).then(product => {
        if (product) {
            getPlan(product.id, donationFrequency).then(plan => {
                if (plan) {
                    createSubscription(customerId, plan.id).then(subscription => {
                        res.send(subscription);
                    })
                    .catch(err => { res.send(err); });
                } else {
                    createPlan(donationAmount, donationFrequency, product.id).then(newPricingPlan => {
                        createSubscription(customerId, newPricingPlan.id).then(subscription => {
                            res.send(subscription);
                        })
                        .catch(err => { res.send(err); });
                    })
                    .catch(err => { res.send(err); });
                }
            })
            .catch(err => { res.send(err); });
        } else {
            let newProduct = {
                name: charity.fields.charityName,
                type: 'service',
                statement_descriptor: `Donation subscription`
            }
            createPlan(donationAmount, donationFrequency, newProduct).then(newPlan => {
                createSubscription(customerId, newPlan.id).then(subscription => {
                    res.send(subscription);
                })
                .catch(err => { res.send(err); });
            })
            .catch(err => { res.send(err); });
        }
    })
    .catch(err => { res.send(err); });
});

/***************************************************************************
 *                                                                         *
 *    Get all cards of user.                                               *   
 *                                                                         *
 ***************************************************************************/
app.post('/user-cards', function(req, res) {
    const email = req.body.email;
    getCustomersByEmail(email).then(customers => {
        let getCardsPromises = [];
        for (var i = 0; i < customers.data.length; i++) {
            getCardsPromises.push(getCards(customers.data[i].id));
        }
        Promise.all(getCardsPromises).then(cardCollection => {
            let cards = [];
            for (var i = 0; i < cardCollection.length; i++) {
                Array.prototype.push.apply(cards, cardCollection[i].data);
            }
            res.send(cards);
        })
        .catch(err => { res.send(err); });
    })
    .catch(err => { res.send(err); });
});


/***************************************************************************
 *                                                                         *
 *    Service functions                                                    *   
 *                                                                         *
 ***************************************************************************/
// Get customers by email
function getCustomersByEmail(email) {
    return new Promise(function(resolve, reject) {
        stripe.customers.list(
            { email: email },
            function(err, customers) {
                if (err) reject(err);
                resolve(customers);
            }
        );
    });
}

// Get all cards of a customer
function getCards(customerId) {
    return new Promise(function(resolve, reject) {
        stripe.customers.listCards(customerId, function(err, cards) {
            if (err) reject(err);
            resolve(cards);
        });
    });
}

// Create new customer
function createCustomer(email, token) {
    return new Promise(function(resolve, reject) {
        stripe.customers.create({
            email: email,
            source: token
        },
        function(err, customer) {
            if (err) reject(err);
            resolve(customer);
        });
    });
}

// Get exsting customer by card id.
function getCustomerByCard(cardId) {
    return new Promise(function(resolve, reject) {
        stripe.customers.retrieveCard(
            cardId,
            function(err, card) {
                if (err) reject(err);
                resolve(card.customer);
            }
        );
    });
}

// Get all products list.
function getAllProducts() {
    return new Promise(function(resolve, reject) {
        stripe.products.list({
            limit: 100
        },
        function(err, products) {
            if (err) reject(err);
            resolve(products.data);
        });
    });
}

// Get a product by name. if prodcut dont exist, return false.
function getProductByName(name) {
    return new Promise(function(resolve, reject) {
        getAllProducts().then(products => {
            for (var i = 0; i < products.length; i++){
                if (products[i].name == name){
                    resolve(products[i]);
                }
            }
            resolve(false);
        })
        .catch(err => reject(err));
    });
}

// Get a plan by product and interval. if plan dont exist, return false.
function getPlan(productId, interval) {
    return new Promise(function(resolve, reject) {
        stripe.plans.list(
            { product: productId, interval: interval },
            function(err, plans) {
                if (err) {
                    reject(err);
                } else if (plans.data.length > 0) {
                    resolve(plans.data[0]);
                } else {
                    resolve(false);
                }
            }
        );
    });
}

// Create new subscription.
function createSubscription(customerId, planId) {
    return new Promise(function(resolve, reject) {
        stripe.subscriptions.create({
            customer: customerId,
            items: [
                { plan: planId }
            ]
        }, function(err, subscription) {
            if (err) reject(err);
            resolve(subscription);
        });
    });
}

// Create new plan.
function createPlan(amount, interval, product) {
    return new Promise(function(resolve, reject) {
        stripe.plans.create({
            currency: 'usd',
            amount: amount,
            interval: interval,
            product: product
        }, function(err, plan) {
            if (err) reject(err);
            resolve(plan);
        });
    });
}

// Get a user by uid.
function getUser(id) {
    return database.ref('/users/' + id).once('value');
}

// Collect user informations
function collectUserInfo(subscriptions) {
    return new Promise(function(resolve, reject) {
        let contributions = [];
        let productIds = [];
        let getInvoicesPromises = [];
        let getProductPromises = [];
        for (var i = 0; i < subscriptions.length; i++) {
            getInvoicesPromises.push(getInvoices(subscriptions[i].id, subscriptions[i].customer));
            getProductPromises.push(getProduct(subscriptions[i].plan.product));
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
                            for (var j = 0; j < invoices[i].length; j++) {
                                totalAmount += invoices[i][j].total;
                            }
                            contributions[i]['ytd'] = totalAmount/100;
                            contributions[i]['amount'] =  invoices[i][0].amount_paid/100;
                            contributions[i]['schedule'] = subscriptions[i].plan.interval;
                            contributions[i]['projection'] = calcYearProjection(contributions[i]);
                        }
                        resolve(contributions);
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
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
                resolve(invoices.data);
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
