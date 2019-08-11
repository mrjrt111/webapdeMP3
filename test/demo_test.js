const mocha = require('mocha');
const User =  require('../models/User')
describe ('Database testing', function () {

    it('Sign Up',function () {
        var user = {
            username: 'johnny',
            password: 'nyeh'
        }

        User.signup(user).then((user=>{
            console.log("successful " + user)
            assert(true)
            done();
        }))

    } )
})