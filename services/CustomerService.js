const mongoose = require('mongoose');

const Customer = require('../models/Customer');
const ValidationError = require('../models/custom/ValidationError');
const isValidPhoneNumber = require('../utilities/isValidPhoneNumber').isValidPhoneNumber;
const isValidEmail = require('../utilities/isValidEmail').isValidEmail;
const notification_types = require('../config/notifications').notifications.notification_types;
const TwilioService = require('../services/TwilioService');
const EmailService = require('../services/EmailService');

class CustomerService {
    constructor() {}

    static async getOrCreateCustomer({customer, location}){
        var updateFields = {};
        var locations = [];
        try{
            if(!customer.customerId){
                if(!customer.phone && !customer.email) throw new ValidationError('ValidationError', 'Phone or Email is required');
                if(customer.phone && !isValidPhoneNumber(customer.phone)) throw new ValidationError('ValidationError', 'Phone is incorrect format');
                if(!customer.firstName || (customer.firstName && customer.firstName.length <= 1)) throw new ValidationError('ValidationError', 'First Name should not be empty and it should have 3 characters at least.');
                if(!customer.lastName || (customer.lastName && customer.lastName.length <= 1)) throw new ValidationError('ValidationError', 'Last Name should not be empty and it should have 3 characters at least.');
                if(customer.email && !isValidEmail(customer.email)) throw new ValidationError('ValidationError', 'Email is incorrect format');
                if(location) locations.push(location._id);

            } else {
                if(!mongoose.Types.ObjectId.isValid(customer.customerId)){
                    return null;
                }

                var customerExisting = await Customer.findOne({_id: customer.customerId});
                if(!customerExisting) return null;

                customerExisting = customerExisting.toObject();
                if(!customerExisting.locations.includes(location)){
                    locations.push(location);
                }

            }

            updateFields = {
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: customer.phone,
                email: customer.email,
                notes: customer.notes,
                currentStatus: customer.currentStatus,
                locations: locations
            };

            const customerFound = await Customer.findOneAndUpdate({$or: [{_id: customer.customerId}, {email: customer.email}, {phone: customer.phone}, {firstName: customer.firstName, lastName: customer.lastName}], isDeleted: false},
                {
                    ...updateFields,
                    notificationTypes: (!customer.notificationTypes) ? ['email', 'text'] : customer.notificationTypes,
                    isDeleted: false,
                    createdAt: new Date(),
                    updateAt: new Date()
                }, {upsert: true, useFindAndModify: false, returnOriginal: false});
            
            return customerFound;
        }
        catch(err){
            throw err;
        }
    }

    static async sendScheduledVisitNotification({customer, company, location, visit}){
        if(!customer.notificationTypes) return;
        if(customer.notificationTypes.length === 0) return;

        for(let notification of customer.notificationTypes){
            switch(notification){
                case notification_types.TEXT.name:
                    await TwilioService.sendSMSForScheduledVisit({customer: customer, company: company, location: location, visit: visit});
                break;
                case notification_types.EMAIL.name:
                    await EmailService.sendEmailForScheduledVisit({customer: customer, company: company, location: location, visit: visit});
                break;
                default:
                    continue;
            }
        }
    }

    static async sendBookedVisitNotification({customer, company, location, visit}){
        if(!customer.notificationTypes) return;
        if(customer.notificationTypes.length === 0) return;

        for(let notification of customer.notificationTypes){
            switch(notification){
                case notification_types.TEXT.name:
                    await TwilioService.sendSMSForBookingVisit({customer: customer, company: company, location: location, visit: visit});
                break;
                case notification_types.EMAIL.name:
                    await EmailService.sendEmailForBooking({customer: customer, company: company, location: location, visit: visit});
                break;
                default:
                    continue;
            }
        }
    }
}

module.exports = CustomerService;