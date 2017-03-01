import '../interfaces/marker.interface';

import { Injectable } from '@angular/core';
import { DataStorageService } from '../services/data_storage.service';

@Injectable()
export class MarkerService {

    constructor( private tDataStorageService: DataStorageService ){}

    createMarker(item:IDataListItem, map: google.maps.Map){
      let newMarker = {
          position: { lat: +item.coord.lat, lng: +item.coord.lon },
          map: map,
          icon: {
              url: `http://openweathermap.org/img/w/${item.weather[0].icon}.png`,
              size: new google.maps.Size(50, 100)
          },
          label: {
              text: `${item.name} ${Math.round(item.main.temp - 273.15)} °C`,
              color: "rgb(254, 171, 46)",
              fontSize: '18px'
          },
          title: item.name
      };
      this.tDataStorageService.markers.push(new google.maps.Marker(newMarker));
    }

    createMarkers(list: Array<IDataListItem>, map: google.maps.Map) {
        list.forEach((variable: IDataListItem) => {
            let newMarker = {
                position: { lat: +variable.coord.lat, lng: +variable.coord.lon },
                map: map,
                icon: {
                    url: `http://openweathermap.org/img/w/${variable.weather[0].icon}.png`,
                    size: new google.maps.Size(50, 100)
                },
                label: {
                    text: `${variable.name} ${Math.round(variable.main.temp - 273.15)} °C`,
                    color: "rgb(254, 171, 46)",
                    fontSize: '18px'
                },
                title: variable.name
            }
            this.tDataStorageService.markers.push(new google.maps.Marker(newMarker));
        });
    }

    deleteMarker(marker: google.maps.Marker){
      marker.setMap(null);
    }
}
