import {Injectable} from '@angular/core';
import '../interfaces/weather.interface';

@Injectable()
export class WeatherService {

    getWeather(lat: number, lon: number, count: number): Promise<Object> {
        return new Promise((resolve: Function, reject: Function) => {
            let xhr = new XMLHttpRequest(),
                weather: IWeather;

            xhr.open('GET', `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=${count}&&APPID=1c7ecf45bce8b3c0fe6043ec72db7c26`, true);
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    weather = JSON.parse(xhr.responseText);
                    weather.createTime = Date.now();

                    resolve(weather);
                }

                if( xhr.status == 502) {
                  setTimeout(() => {
                      xhr.open('GET', `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=${count}&&APPID=1c7ecf45bce8b3c0fe6043ec72db7c26`, true);
                      xhr.send();
                      xhr.onreadystatechange = () => {
                          if (xhr.readyState == 4 && xhr.status == 200) {
                              weather = JSON.parse(xhr.responseText);
                              weather.createTime = Date.now();

                              resolve(weather);
                          }
                        }
                    }, 2000);
                }
            }
        });
    }

    getWeatherByCityId( id: string ): Promise<Object> {
      return new Promise((resolve: Function, reject: Function) => {
          let xhr = new XMLHttpRequest(),
              weather: IWeather;
          xhr.open('GET', `http://api.openweathermap.org/data/2.5/weather?id=${id}&&APPID=1c7ecf45bce8b3c0fe6043ec72db7c26`, true);
          xhr.send();
          xhr.onreadystatechange = () => {
              if (xhr.readyState == 4 && xhr.status == 200) {
                  weather = JSON.parse(xhr.responseText);
                  resolve(weather);
              }
          }
      });
    }

    getWeatherByCoords(lat: number, lon: number){
      return new Promise((resolve: Function, reject: Function) => {
          let xhr = new XMLHttpRequest(),
              weather: IWeather;
          xhr.open('GET', `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&&APPID=1c7ecf45bce8b3c0fe6043ec72db7c26`, true);
          xhr.send();
          xhr.onreadystatechange = () => {
              if (xhr.readyState == 4 && xhr.status == 200) {
                  weather = JSON.parse(xhr.responseText);
                  resolve(weather);
              }
          }
      });
    }
}
