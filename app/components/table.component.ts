import '../interfaces/table.interface';
import '../interfaces/position.interface';

import { Component, ChangeDetectorRef, OnInit, ChangeDetectionStrategy, OnDestroy, OnChanges} from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { OrderByPipe } from '../pipes/order_by.pipe';
import { DataStorageService } from '../services/data_storage.service';
import { WeatherService } from '../services/weather.service';
import { MarkerService } from '../services/marker.service';
import { template } from '../templates/table.template';


@Component({
    selector: 'table-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [],
    template: template
})

export class TableComponent implements OnInit, OnChanges, OnDestroy {
    weather: IWeather;
    date: Date;
    format: string;
    tableVisibility: boolean;
    interval: number;
    curentCity: IDataListItem;
    currentLocation: ICoord;
    currenMap: google.maps.Map;
    currentWeather: IWeather;
    curLocSubscription: Subscription;
    curMap: Subscription;
    curWeather: Subscription;

    constructor(
        private tDataStorageService: DataStorageService,
        private tWeatherService: WeatherService,
        private tMarkerService: MarkerService,
        private cd: ChangeDetectorRef
    ) {

    }

    ngOnInit() {
      this.interval = (<IWindow>window).setInterval(() => {
        this.cd.markForCheck()
      }, 5000);
      this.curLocSubscription = this.tDataStorageService.location$.subscribe(value => {
        this.currentLocation = value.geometry.location;
      });
      this.curMap = this.tDataStorageService.map$.subscribe(value => {
        this.currenMap = value;
      });
      this.curWeather = this.tDataStorageService.weather$.subscribe(value => {
        this.currentWeather = value;
      });
        if (localStorage.getItem('weather')) {
            this.weather = this.tDataStorageService.getFromLocStor('weather');
            this.clearFavor();
            if(!this.weather.list[0].favor)this.weather.list[0].favor = true;
            this.date = new Date(this.weather.createTime);
            this.tableVisibility = false;
            this.curentCity = this.tDataStorageService.deepObjectCopy(this.weather.list[0]);
            this.format = 'celsia';
        } else {
            //(<IWindow>window).setTimeout(this.ngOnInit(), 2000)
        }
    }

    ngOnChanges() {
        // this.weather.list = new OrderByPipe().transform(this.weather.list, 'favor');
    }

    ngOnDestroy() {
        clearInterval(this.interval);
        this.curLocSubscription.unsubscribe()
    }

    tryToChange(event: IDataListItem) {
        this.weather.list.forEach((value: IDataListItem) => {
            if (value.id === event.id) { return }
            value.favor = false;
        })
        this.tDataStorageService.saveToLocStor('weather', this.weather);
        this.weather = this.tDataStorageService.getFromLocStor('weather');
    }

    addNearestCity(){
      this.tWeatherService.getWeatherByCoords(this.currentLocation.lat, this.currentLocation.lng).then(( value:IDataListItem ) => {
        let flag: boolean;
        flag = false;
        this.weather.list.forEach(( list_value:IDataListItem ) => {
          if(!flag){
            flag = value.id == list_value.id;
          }
          if(value.id == list_value.id){
            this.clearFavor();
            list_value.favor = true;
          }
        });
        if(!flag){
          this.weather.list.push(value);
          this.tMarkerService.createMarker(value, this.currenMap)
          console.log(`added ${value.name}`)
        }
        this.cd.markForCheck();
        // let index: number = this.weather.list.indexOf(value);
        // if(index<0){
        //   this.weather.list.push(value)
        //   console.log(value, index);
        // } else {
        //   this.weather.list[index].favor= true;
        // }
      })
    }

    clearFavor(){
      this.weather.list.forEach(variable => {
          variable['favor'] = false;
      });
    }

    deleteItem(event: IDataListItem){
      this.weather.list.forEach((value: IDataListItem, index: number) => {
          if (value.id === event.id) {
            this.tDataStorageService.markers.forEach((val, i)=>{
              if(value.name === val['title']){
                this.tMarkerService.deleteMarker(val);
                this.tDataStorageService.markers.splice(i, 1);
              }
            })
            this.weather.list.splice(index, 1);
          }
      })
    }

    tableToggle(): void {
        this.tableVisibility = !this.tableVisibility;
    }

    checkFormat(newValue: string): void {
        this.format = newValue;
    }
}
