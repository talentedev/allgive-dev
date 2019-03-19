module.exports = function(invoiceService, productService) {
    return {
        // Collect user informations
        collectUserInfo: function(subscriptions) {
            return new Promise(function(resolve, reject) {
                let contributions = [];
                let productIds = [];
                let getInvoicesPromises = [];
                let getProductPromises = [];
                for (var i = 0; i < subscriptions.length; i++) {
                    getInvoicesPromises.push(invoiceService.getInvoices(subscriptions[i].id, subscriptions[i].customer));
                    getProductPromises.push(productService.getProduct(subscriptions[i].plan.product));
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
                                    contributions[i]['invoices'] = invoices[i];
                                }
                                resolve(contributions);
                            })
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
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
