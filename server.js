const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const firebase = require('firebase');
const stripe = require('stripe')('sk_test_LVx3d8fWhuQl1YCV3BnfWzP4');
const customerService = require('./server/services/stripe/customer')(stripe);
const planService = require('./server/services/stripe/plan')(stripe);
const productService = require('./server/services/stripe/product')(stripe);
const subscriptionService = require('./server/services/stripe/subscription')(stripe);
const invoiceService = require('./server/services/stripe/invoice')(stripe);
const cardService = require('./server/services/stripe/card')(stripe);
const userService = require('./server/services/stripe/user')(invoiceService, productService);
const dateService = require('./server/services/common/date');

const fbConfig = require('./firebase.json');

// Initialize Firebase
firebase.initializeApp(fbConfig);

let database = firebase.database();
let fbAuth = firebase.auth();
const fbDB = require('./server/services/firebase/database')(database);

const app = express();

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
    if (!err) {
        next();
    }
    console.log(err.stack);
    res.status(err.status || 500);
    res.send(err);
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
    fbDB.getUserByEmail(email).then(snapshot => {
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
    fbDB.getUserById(userId).then(user => {
        let userData = user.val();
        customerService.getCustomersByEmail(userData.email).then(customers => {
            let subscriptions = [];
            let cards = [];
            let collectUserInfoPromises = [];
            for (var i = 0; i < customers.data.length; i++) {
                collectUserInfoPromises.push(userService.collectUserInfo(customers.data[i].subscriptions.data));
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
            });
        });
    });
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

    let data = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        created: dateService.now(),
        activated: 'null',
        lastlogin: 'null',
        logincount: 0,
        recent: 'null'
    }
    fbDB.createUser(uid, data).then(res => {
        res.send({result: 'success'});
    });
});

/***************************************************************************
 *                                                                         *
 *     Update user activities                                              *   
 *                                                                         *
 ***************************************************************************/
app.post('/update-activity', function(req, res) {
    const uid = req.body.uid;
    fbDB.getUserById(uid).then(snapshot => {
        var user = snapshot.val();
        var now = dateService.now();
        if (user.activated === 'null') {
            user.activated = now;
        }
        user.logincount +=1;
        user.lastlogin = now;
        user.recent = now;
        fbDB.updateUser(uid, user).then(snapshot => {
            res.send(snapshot);
        });
    });
});

/***************************************************************************
 *                                                                         *
 *     Update user profile                                                 *   
 *                                                                         *
 ***************************************************************************/
app.post('/update-profile', function(req, res) {
    const uid = req.body.uid;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    fbDB.getUserById(uid).then(snapshot => {
        var user = snapshot.val();
        user.firstName = firstName;
        user.lastName = lastName;
        fbDB.updateUser(uid, user).then(snapshot => {
            res.send(snapshot);
        });
    });
});

/***************************************************************************
 *                                                                         *
 *     Update recent activities                                            *   
 *                                                                         *
 ***************************************************************************/
app.post('/recent-activity', function(req, res) {
    const uid = req.body.uid;
    fbDB.getUserById(uid).then(snapshot => {
        var user = snapshot.val();
        var now = dateService.now();
        user.recent = now;
        fbDB.updateUser(uid, user).then(snapshot => {
            res.send(snapshot);
        });
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

    customerService.createCustomer(authUser.email, token.id).then(customer => {
        productService.getProductByName(charity.fields.charityName).then(product => {
            if (product) {
                planService.getPlan(product.id, donationFrequency).then(plan => {
                    if (plan) {
                        subscriptionService.createSubscription(customer.id, plan.id).then(subscription => {
                            res.send(subscription);
                        });
                    } else {
                        planService.createPlan(donationAmount, donationFrequency, product.id).then(newPricingPlan => {
                            subscriptionService.createSubscription(customer.id, newPricingPlan.id).then(subscription => {
                                res.send(subscription);
                            });
                        });
                    }
                });
            } else {
                let newProduct = {
                    name: charity.fields.charityName,
                    type: 'service',
                    statement_descriptor: `Donation subscription`
                }
                planService.createPlan(donationAmount, donationFrequency, newProduct).then(newPlan => {
                    subscriptionService.createSubscription(customer.id, newPlan.id).then(subscription => {
                        res.send(subscription);
                    });
                });
            }
        });

        // Save card information to DB.
        fbDB.createPayment(authUser.uid, {
            id: token.id,
            brand: token.brand,
            customer: token.customer,
            exp_month: token.exp_month,
            exp_year: token.exp_year,
            last4: token.last4,
            active: true
        });
    });
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

    productService.getProductByName(charity.fields.charityName).then(product => {
        if (product) {
            planService.getPlan(product.id, donationFrequency).then(plan => {
                if (plan) {
                    subscriptionService.createSubscription(customerId, plan.id).then(subscription => {
                        res.send(subscription);
                    });
                } else {
                    planService.createPlan(donationAmount, donationFrequency, product.id).then(newPricingPlan => {
                        subscriptionService.createSubscription(customerId, newPricingPlan.id).then(subscription => {
                            res.send(subscription);
                        });
                    });
                }
            });
        } else {
            let newProduct = {
                name: charity.fields.charityName,
                type: 'service',
                statement_descriptor: `Donation subscription`
            }
            planService.createPlan(donationAmount, donationFrequency, newProduct).then(newPlan => {
                subscriptionService.createSubscription(customerId, newPlan.id).then(subscription => {
                    res.send(subscription);
                });
            });
        }
    });
});

/***************************************************************************
 *                                                                         *
 *    Get all cards of user.                                               *   
 *                                                                         *
 ***************************************************************************/
app.post('/user-cards', function(req, res) {
    const email = req.body.email;
    customerService.getCustomersByEmail(email).then(customers => {
        let getCardsPromises = [];
        for (var i = 0; i < customers.data.length; i++) {
            getCardsPromises.push(cardService.getCards(customers.data[i].id));
        }
        Promise.all(getCardsPromises).then(cardCollection => {
            let cards = [];
            for (var i = 0; i < cardCollection.length; i++) {
                Array.prototype.push.apply(cards, cardCollection[i].data);
            }
            res.send(cards);
        });
    });
});

/***************************************************************************
 *                                                                         *
 *    Update user's card                                                   *   
 *                                                                         *
 ***************************************************************************/
app.post('/update-card', function(req, res) {
    const cardId = req.body.id;
    const customerId = req.body.customer;
    const data = {
        name: req.body.name,
        address_city: req.body.city,
        address_line1: req.body.address,
        address_state: req.body.state,
        address_zip: req.body.zip,
        exp_month: req.body.expMonth,
        exp_year: req.body.expYear
    };
    cardService.update(customerId, cardId, data).then(card => {
        res.send(card);
    });
});

/***************************************************************************
 *                                                                         *
 *    Delete user's card                                                   *
 *                                                                         *
 ***************************************************************************/
app.post('/delete-card', function(req, res) {
    const isDelete = req.body.isDelete;
    const card = req.body.card;
    const assignedCard =req.body.assignedCard;
    const newCustomer = assignedCard.customer;
    const oldCustomer = card.customer;

    if (isDelete) {
        customerService.deleteCustomer(oldCustomer).then(confirm => {
            res.send(confirm);
        });
    } else {
        customerService.getCustomer(oldCustomer).then(customer => {
            let createSubscriptionPromises = [];
            const subscriptions = customer.subscriptions.data;
            for (var i = 0; i < subscriptions.length; i++) {
                createSubscriptionPromises.push(subscriptionService.createSubscription(newCustomer, subscriptions[i].plan.id));
            }
            Promise.all(createSubscriptionPromises).then(response => {
                customerService.deleteCustomer(oldCustomer).then(confirm => {
                    res.send(confirm);
                });
            });
        });
    }
});

/***************************************************************************
 *                                                                         *
 *    Manage APIs                                                            *
 *                                                                         *
 ***************************************************************************/
app.post('/sync-payments', function(req, res) {
    fbDB.getAllUsers().then(function(users){
        users.forEach(function(user){
            customerService.getCustomersByEmail(user.val().email).then(function(customers) {
                for (var i = 0; i < customers.data.length; i++) {
                    cardService.getCards(customers.data[i].id).then(function(card) {
                        fbDB.createPayment(user.key, {
                            id: card.data[0].id,
                            brand: card.data[0].brand,
                            customer: card.data[0].customer,
                            exp_month: card.data[0].exp_month,
                            exp_year: card.data[0].exp_year,
                            last4: card.data[0].last4,
                            active: true
                        });
                    });
                }
            });
        });
    });
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
