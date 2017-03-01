import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import '../interfaces/weather.interface';
import '../interfaces/position.interface';

@Injectable()
export class DataStorageService {
    private location = new Subject<IResult>();
    private map = new Subject<google.maps.Map>();
    private weather = new Subject<IWeather>();
    private coords = new Subject<ICoordinates>();

    public markers: google.maps.Marker[] = [];

    location$ = this.location.asObservable();
    map$ = this.map.asObservable();
    weather$ = this.weather.asObservable();
    coords$ = this.coords.asObservable();

    setLocation(location: IResult) {
      if(location) {
        this.location.next(location);
      }
    }

    setMap(map: google.maps.Map){
      if(map) {
        this.map.next(map);
      }
    }

    setCoords(coords: ICoordinates){
      if(coords) {
        this.coords.next(coords);
      }
    }

    setWeather(weather: IWeather){
      if(weather) {
        this.weather.next(weather);
      }
    }

    //+because this services cannot know which data will come to it, they will be <any> type
    saveToLocStor(key: string, data: any){
      localStorage.setItem(key, JSON.stringify(data));
    }
    getFromLocStor(key: string): any {
      return JSON.parse(localStorage.getItem(key));
    }
    deepObjectCopy(obj: any) {
      return JSON.parse(JSON.stringify(obj));
    }
    //-because this service cannot know which data will come to it
}
