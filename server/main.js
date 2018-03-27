import { Meteor } from 'meteor/meteor';
import { xml2js } from 'meteor/peerlibrary:xml2js';

Courses = new Mongo.Collection('courses');

Meteor.startup(function () {

});

Meteor.methods({
    'getXMLFromAPI': function () {
        this.unblock();
        var apiUrl = 'http://store.volusion.com/net/WebService.aspx?Login=me@mystore.com&EncryptedPassword=myencryptionkey&EDI_Name=Generic\\Products&SELECT_Columns=*';
        var response = Meteor.wrapAsync(apiCall)(apiUrl);
        console.log(response);
        return response;
    },
    'getJSONFromAPI': function () {
        this.unblock();
        var apiUrl = 'http://store.volusion.com/net/WebService.aspx?Login=me@mystore.com&EncryptedPassword=myencryptionkey&EDI_Name=Generic\\Products&SELECT_Columns=*';

        var response = Meteor.wrapAsync(apiCall)(apiUrl);

        const result = xml2js.parseStringSync(response, { explicitArray: false, emptyTag: undefined });
        //console.log('Result - ', util.inspect(result.xmldata.Products, false, null));

        for (var i = 0; i < result.xmldata.Products.length; i++) {
            Courses.insert(result.xmldata.Products[i]);
        }
        return result;
    }
});

var apiCall = function (apiUrl, callback) {
    // try…catch allows you to handle errors 
    try {
        var response = HTTP.get(apiUrl).content;
        // A successful API call returns no error 
        callback(null, response);
    } catch (error) {
        // If the API responded with an error message and a payload 
        if (error.response) {
            var errorCode = error.response.data.code;
            var errorMessage = error.response.data.message;
            // Otherwise use a generic error message
        } else {
            var errorCode = 500;
            var errorMessage = 'Cannot access the API';
        }
        // Create an Error object and return it via callback
        var myError = new Meteor.Error(errorCode, errorMessage);
        callback(myError, null);
    }
}
