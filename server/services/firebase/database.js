module.exports = function(database) {
    return {
        // Get a user by uid.
        getUserById: function(uid) {
            return database.ref('/users/' + uid).once('value');
        },
        // Get a user by email
        getUserByEmail: function(email) {
            return database.ref('users').orderByChild("email").equalTo(email).once("value");
        },
        // Create new user
        createUser: function(uid, data) {
            return database.ref('users/' + uid).set(data);
        },
        // Update user
        updateUser: function(uid, data) {
            var updates = {};
            updates['/users/' + uid] = data;
            return database.ref().update(updates);
        },
        // Create user's new payment
        createPayment: function(uid, data) {
            return database.ref('payments/' + uid).push(data);
        }
    }
}
