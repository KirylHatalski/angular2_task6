import '../interfaces/position.interface';
import '../interfaces/weather.interface';

import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { PositionService } from '../services/position.service';
import { PositionCheckService } from '../services/position_check.service';
import { MarkerService } from '../services/marker.service';
import { DataStorageService } from '../services/data_storage.service';

@Component({
    selector: 'googlemaps',
    // providers: [PositionService, MarkerService, PositionCheckService, ],
    template: `<div class='map'></div>
               <div class='central'>[ ]</div>`
})

export class GooglemapsComponent implements OnInit, OnChanges {
    private coord_temp: ICoordinates;
    private count: number;
    private map: google.maps.Map;
    private curCoord: Subscription;


    constructor(
        public tMarkerService: MarkerService,
        public tPositionService: PositionService,
        public tDataStorageService: DataStorageService,
        public tPositionCheckService: PositionCheckService) {
          this.curCoord = this.tDataStorageService.coords$.subscribe((value: ICoordinates) => {
            this.coord_temp = value;
          });
         }

    ngOnInit() {
        this.tPositionService.getPosition().then((data: ICoordinates) => {
            this.tDataStorageService.setCoords(data)
            this.initMap()
        });
    }

    ngOnChanges() {

    }


    initMap() {
        let elem = document.createElement('script'),
            coords: ICoordinates,
            markers: IWeather;

        this.count = 0;
        coords = this.coord_temp;
        // this.tDataStorageService.setCoords()



        elem.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA2BbPGgt4MP4YD12z5AftgBgGS9vitNJE&callback=googleResponse`;
        document.body.appendChild(elem);

        (<IWindow>window).googleResponse = () => {
            markers = this.tDataStorageService.getFromLocStor('weather');

            this.map = new google.maps.Map(document.querySelector('.map'), {
                center: { lat: coords.latitude, lng: coords.longitude },
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.SATELLITE
            });

            this.getStartLocation(this.map, coords);
            this.tDataStorageService.setMap(this.map);

            google.maps.event.addListener(this.map, 'bounds_changed', () => {
                // this.coord_temp = coords
                this.tPositionService.getViewPortCoordinates(this.map).then((value: ICoord) => {
                  this.tDataStorageService.setCoords({
                      latitude: value.lat,
                      longitude: value.lng
                  });
                })
                if (this.count > 30) {
                    this.count = 0;
                    this.tPositionCheckService.getCurrentLocationData(this.map).then((value: IPositionCheck) => {
                        if (value.status == 'OK') {
                            this.tDataStorageService.setCoords({
                                latitude: value.results[0].geometry.location.lat,
                                longitude: value.results[0].geometry.location.lng
                            });
                            this.tDataStorageService.setLocation(value.results[0]);
                        }
                    });
                } else {
                    this.count += 1;
                }
            })

            if (localStorage.getItem('weather')) {
                this.tMarkerService.createMarkers(markers.list, this.map);
            } else {
                setTimeout((<IWindow>window).googleResponse, 2000);
            }
        }
    }

    getStartLocation(map: google.maps.Map, coords: ICoordinates) {
        this.tPositionCheckService.getCurrentLocationData(map, null).then((value: IPositionCheck) => {
            if (value.status == 'OK') {
                this.coord_temp = {
                    latitude: value.results[0].geometry.location.lat,
                    longitude: value.results[0].geometry.location.lng
                }
                this.tDataStorageService.setLocation(value.results[0]);
            }
        });
    }
}
