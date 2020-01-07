/*
* ResponseDTO
* Overview: This class will store data provided in the controller and use as a response.
----------------------------------------------------------------------
* Project Name : CRM Step 3
----------------------------------------------------------------------
* Author       : Accenture, Glenn Patrick Cua
* Created Date : 2018/06/12
* Updated Date : 2018/08/24
----------------------------------------------------------------------
* Copyright (C) 2018 Accenture. All Rights Reserved.
*/
public class ResponseDTO{
    
    @AuraEnabled
    public String responseData{get; set;}
    
    @AuraEnabled
    public String errorMessage{get; set;}
    
    @AuraEnabled
    public String stackTrace{get; set;}
    
    @AuraEnabled
    public String errorMessageType{get; set;}
    
    @AuraEnabled
    public Boolean isError{get; set;}
    
    /*===============================================
    * Class Constructor
    * Setting default values
    =================================================*/
    public ResponseDTO(){
    
        isError = false;
    }
    
    /*================================================
    * Method for serializing object to JSON format
    * @param Object type
    ==================================================*/
    public void setResponseData(Object obj){
        
        responseData = JSON.serialize(obj);
    }
       
    /*========================================================
    * Method for serializing list of objects to JSON format
    * @param List of Object type
    ==========================================================*/
    public void setResponseData(List<Object> obj){
        responseData = JSON.serialize(obj);
    }
    
    /*======================================================
    * Method for setting bussines errors
    * @param String of error message to be displayed
    ========================================================*/
    public void setBusinessErrors(String errorMsg){
        
        errorMessage = errorMsg;
        errorMessageType = 'Business Error';
        isError = true;
    }
    
    /*===========================================================================
    * Method for setting exception errors
    * @param String of error message, caught by an exception, to be displayed
    =============================================================================*/
    public void setExceptionErrors(Exception exc){
        
        errorMessage = exc.getMessage();
        stackTrace = exc.getStackTraceString();
        isError = true;
        errorMessageType = 'Exception Error';
    }
}