module.exports = function(stripe) {
    return {
        // Create new customer
        createCustomer: function(email, token) {
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
        },

        // Get a customer
        getCustomer: function(id) {
            return new Promise(function(resolve, reject) {
                stripe.customers.retrieve(id, function(err, customer) {
                    if (err) reject(err);
                    resolve(customer);
                });
            });
        },

        // Delete a customer
        deleteCustomer: function(id) {
            return new Promise(function(resolve, reject) {
                stripe.customers.del(id, function(err, confirmation) {
                    if (err) reject(err);
                    resolve(confirmation);
                });
            });
        },

        // Get customers by email
        getCustomersByEmail: function(email) {
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
    }
}
