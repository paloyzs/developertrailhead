/* eslint-disable no-console */
/* eslint-disable no-alert */
/*eslint no-console: “error”*/
import { LightningElement, track, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import OWNER_NAME_FIELD from '@salesforce/schema/Account.OwnerId';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
//import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

import getAccountContacts from '@salesforce/apex/LWCContactController.getAccountContacts';

const columns = [
    { label: 'Account Name', fieldName: 'AccountName' },
    { label: 'Contact Name', fieldName: 'Name'},
    { label: 'Title', fieldName: 'Title' }
];

export default class MyFirstWebComponent extends LightningElement {
    
    /*@track
    contacts = [
        {
            Id: 1,
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
        },
        {
            Id: 2,
            Name: 'Michael Jones',
            Title: 'VP of Sales',
        },
        {
            Id: 3,
            Name: 'Jennifer Wu',
            Title: 'CEO',
        },
    ];*/
    
    //Data-Table values
    @track columns = columns;

    @track account;
    @track name;
    @track contacts
    @api recordId;

    @wire(getRecord, {recordId: '$recordId', fields: [NAME_FIELD], optionalFields: [OWNER_NAME_FIELD, PHONE_FIELD]})
    wiredRecord({error, data}){
        
        if(error){
            this.errorFunction(error);
        }else if(data){
            this.account = data;
            this.name = this.account.fields.Name.value;
            //alert(this.name);
        }
    }
    

    @wire(getAccountContacts, { accId: '$recordId' })
    wiredCcontactRecords({error, data}){
        if(data){
            this.passDataFunction(data);
        }else if(error){
            this.errorFunction(error);
        }
    }

    passDataFunction(data){
        this.contacts = JSON.parse(data.responseData);
        console.log(this.contacts);
        //access parent record and pass to column data in data-table
        for(let i = 0; i < this.contacts.length; i++){
            let row = this.contacts[i];
            if(row.Account){
                row.AccountName = this.name;
            }
        }
    }

    errorFunction(error){
        let message = 'Unknown Error';
        if(Array.isArray(error.body)){
            message = error.body.map(e => e.message).join(', ');
        }else if(typeof error.body.message === 'string'){
            message = error.body.message;
        }

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading account',
                message : message,
                variant: 'error',
            }),
        )
    }

    @track
    ready = false;
    connectedCallback() {
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
            this.ready = true;
        }, 3000);
    }
    
}
