module.exports = function(stripe) {
    return {
        // Create new subscription.
        createSubscription: function(customerId, planId) {
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
    }
}
