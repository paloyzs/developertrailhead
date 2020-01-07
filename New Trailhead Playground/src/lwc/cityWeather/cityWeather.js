/* eslint-disable no-console */
/* eslint-disable no-alert */
import { LightningElement, wire, api, track } from 'lwc';

import { getRecord } from 'lightning/uiRecordApi';

import SHIPPINGCITY_FIELD from '@salesforce/schema/Account.ShippingCity';
import SHIPPINGCOUNTRY_FIELD from '@salesforce/schema/Account.ShippingCountry';

const fields = [SHIPPINGCITY_FIELD, SHIPPINGCOUNTRY_FIELD];

import getCityWeather from '@salesforce/apex/CityWeatherController.getCityWeather';

export default class CityWeather extends LightningElement {

    @api recordId;
    @track account;
    @track shippingCity;
    @track shippingCountry;

    @track locationName;
    @track weatherMain;
    @track weatherErr;

    @track islongLatUsed;
    @track isCityUsed = true;

    //for longitude and latitude
    @api latitude;
    @api longitude;

    @wire(getRecord, {recordId: '$recordId', fields: fields })
    wiredRecord({error, data}){
        
        if(error){
            alert(error);
            //this.errorFunction(error);
        }else if(data){
            this.account = data;
            this.shippingCity = this.account.fields.ShippingCity.value;
            this.shippingCountry = this.account.fields.ShippingCountry.value;
        }
    }

    useCoordsBtn(){
        this.islongLatUsed = true;
        this.isCityUsed = false;
    }

    useCityBtn(){
        this.isCityUsed = true;
        this.islongLatUsed = false;
    }

    handleLocChange(event){
        this.latitude = event.target.latitude;
        this.longitude = event.target.longitude;
    }

    getWeatherBtn(){

        let cityParam = this.shippingCity + ', ' + this.shippingCountry;
        let latLonParam = 'lat=' +this.latitude +'&lon='+this.longitude;
        
        if(!this.isCityUsed){
            cityParam = '';
        }
        if(!this.islongLatUsed){
            latLonParam = '';
        }
        console.log('cityParam', cityParam);
        console.log('latLonParam', latLonParam);
        let params = { cityName : cityParam, latLon : latLonParam };

        getCityWeather( params )
            .then(result => {

                let weatherResp = JSON.parse(result.responseData);
                this.weatherMain = weatherResp.main;

                if(weatherResp.errorMsg){
                    this.weatherErr = weatherResp.errorMsg;
                    this.locationName = '';
                }else{
                    console.log(weatherResp.sys);
                    if(weatherResp.name){
                        this.weatherErr = '';
                        this.locationName = weatherResp.name +', ' +weatherResp.sys.country;
                        //populate tree data
                        this.populateTreeItems(weatherResp);
                    }else{
                        this.locationName = '';
                        this.weatherErr = 'Location cannot be found';
                    }
                }
                
            })
            .catch(error => {
                //this.error = error;
            });
    }

    @track treeItems;

    populateTreeItems(weather){

        let weatherMain = weather.main;

        this.treeItems = [{
            label: 'Main',
            name: '1',
            expanded : true,
            items : [
                {
                    label : 'Temperature: '+weatherMain.temp +' °C',
                    name: '2',
                    expanded: true,
                    items : [],
                },
                {
                    label : 'Temp Max: '+weatherMain.temp_max +' °C',
                    name: '3',
                    expanded: true,
                    items : [],
                },
                {
                    label : 'Temp Min: '+weatherMain.temp_min +' °C',
                    name: '4',
                    expanded: true,
                    items : [],
                },
                {
                    label : 'Pressure: '+weatherMain.pressure +' hPa',
                    name: '5',
                    expanded: true,
                    items : [],
                },
                {
                    label : 'Humidity: '+weatherMain.humidity +' %',
                    name: '6',
                    expanded: true,
                    items : [],
                },
            ],
        }];
    }

}