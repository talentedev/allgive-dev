module.exports = function(stripe) {
    return {
        // Get user's invoices for a subscription.
        getInvoices: function(subscriptionId, customerId) {
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
    }
}
