module.exports = function(stripe) {
    return {
        // Get all products list.
        getAllProducts: function() {
            return new Promise(function(resolve, reject) {
                stripe.products.list({
                    limit: 100
                },
                function(err, products) {
                    if (err) reject(err);
                    resolve(products.data);
                });
            });
        },

        // Get a product by id.
        getProduct: function(productId) {
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
        },

        // Get a product by name. if prodcut dont exist, return false.
        getProductByName: function(name) {
            return new Promise(function(resolve, reject) {
                this.getAllProducts().then(products => {
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
    }
}
