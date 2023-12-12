public with sharing class CityWeatherController {

    public static String appKey = '8a1f5f5fee63a6d8b56d346a9b02e63a';
    public static String endPoint = 'http://api.openweathermap.org/data/2.5/weather';
    public static String unit = '&units=metric';
    //Sample 1347839
    @AuraEnabled(cacheable = true)
    public static ResponseDTO getCityWeather(String cityName, String latLon){
        
        ResponseDTO response = new ResponseDTO();
        Http http = new Http();
        HttpRequest req = new HttpRequest();

        if(cityName != ''){
            cityName = '?q=' +cityName;
            endPoint += cityName;
        } else if(latLon != ''){
            latLon = '?'+latLon;
            endPoint += latLon;
        }
        
        endPoint += '&appid='+appKey;
        endPoint += unit;

        req.setEndpoint(endPoint);
        req.setMethod('GET');
        System.debug(endPoint);
        HTTPResponse httpResp = http.send(req);
        System.debug(httpResp.getBody());
        WeatherJSON2Apex weatherResp = WeatherJSON2Apex.parse(httpResp.getBody());

        response.setResponseData(weatherResp);

        return response;
    }

    
}
