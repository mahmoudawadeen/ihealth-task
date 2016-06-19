import { Meteor } from 'meteor/meteor';

const Settings = new Meteor.Collection('settings');


Meteor.startup(() => {
    // code to run on server at startup
    if (Settings.find().count() === 0) {
        JSON.parse(Assets.getText("settings.json")).settings.forEach(function (doc) {
            Settings.insert(doc);
        });
    }
    Meteor.publish("userData", function () {
        if (this.userId) {
            return [Meteor.users.find({_id: this.userId},
                {
                    fields: {'profile': 1}
                }), Settings.find({})];
        } else {
            return Settings.find({});
        }
    });
    Meteor.publish('users', function () {
        return Meteor.users.find({});
    });
});
Accounts.onCreateUser(function (options, user) {
    user.profile = options.profile || {};
    user.profile.bio = options.bio;
    user.profile.status = options.status;
    user.profile.facebook_link = options.facebook_link;
    user.profile.linkedin_link = options.linkedin_link;
    user.profile.isAdmin = Meteor.users.find().count() == 0;
    return user;
});
