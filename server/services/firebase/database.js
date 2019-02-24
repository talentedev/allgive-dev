module.exports = function(database) {
    return {
        // Get a user by uid.
        getUserById: function(uid) {
            return database.ref('/users/' + uid).once('value');
        },
        // Get a user by email
        getUserByEmail: function(email) {
            return database.ref('users').orderByChild("email").equalTo(email).on("value");
        },
        // Create new user
        createUser: function(uid, data) {
            return database.ref('users/' + uid).set(data);
        }
    }
}
