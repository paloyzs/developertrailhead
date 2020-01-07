public with sharing class LWCContactController {

    @AuraEnabled(cacheable = true)
    public static ResponseDTO getAccountContacts(Id accId){
        System.debug(accId);

        ResponseDTO response = new ResponseDTO();
        response.setResponseData([SELECT Id, Name, Account.Name, AccountId, Title FROM Contact WHERE AccountId =: accId]);

        return response;
    }

}