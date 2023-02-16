/**
 * Created by hermojp on 16/07/17.
 */


var helper = require('sendgrid').mail;
var sendGridConfig = require('../config/sendgrid');
var myLogger = require('./Logger');

var SendMail = function(){};

SendMail.sendBySendGrid = function(from, to, subject, html_content){

    var fromEmail = new helper.Email(from);
    var toEmail = "hermojp@gmail.com";//new helper.Email(to);
    var content = new helper.Content('text/html', html_content);
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);

    myLogger.logCyan("Enviando Email");
    myLogger.logCyan("From: " + from);
    myLogger.logCyan("To: " + to);
    myLogger.logCyan("Subject: " + subject);
    myLogger.logCyan("Content: " + html_content);


    var sg = require('sendgrid')(sendGridConfig.API_KEY);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        if (error) {
            myLogger.logRed('Error response received');
            myLogger.logRed(JSON.stringify(error));

        }
        myLogger.logGreen(response.statusCode);
        myLogger.logGreen(response.body);
        myLogger.logGreen(response.headers);
    });
}//send

module.exports = SendMail;
