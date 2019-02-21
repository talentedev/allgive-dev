module.exports = function(stripe) {
    return {
        // Get all cards of a customer
        getCards: function(customerId) {
            return new Promise(function(resolve, reject) {
                stripe.customers.listCards(customerId, function(err, cards) {
                    if (err) reject(err);
                    resolve(cards);
                });
            });
        }
    }
}
