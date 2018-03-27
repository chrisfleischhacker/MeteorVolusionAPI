import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Courses = new Mongo.Collection('courses');

Meteor.call('getJSONFromAPI', function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log(res.xmldata.Products);
    }
});

Template.vapi.onCreated(function helloOnCreated() {
    console.log('oncreate...');
});

Template.vapi.helpers({
    courses: function () {
        return Courses.find();
    }
});
