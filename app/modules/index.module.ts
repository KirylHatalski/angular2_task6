import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IndexComponent }  from '../components/index.component';
import { WeatherComponent } from '../components/weather.component';
import { GooglemapsComponent } from '../components/googlemaps.component';
import { PositiopCheckerComponent } from "../components/position_check.component";
import { TableComponent } from '../components/table.component';
import { TableRowComponent } from "../components/tablerow.component";
import { TemperaturePipe } from '../pipes/temperature.pipe';
import { OrderByPipe } from '../pipes/order_by.pipe';
import { WindDirective } from '../directives/wind.directive';
import { HotnessDirective } from '../directives/hotness.directive';
import { IconDirective } from '../directives/icon.directive';
import { PositionService } from '../services/position.service';
import { PositionCheckService } from '../services/position_check.service';
import { WeatherService } from '../services/weather.service';
import { DataStorageService } from '../services/data_storage.service';
import { MarkerService } from '../services/marker.service';


import { RxService } from '../services/rx.service';


@NgModule({
    imports: [BrowserModule],
    declarations: [
      IndexComponent,
      WeatherComponent,
      GooglemapsComponent,
      TableComponent,
      TemperaturePipe,
      WindDirective,
      PositiopCheckerComponent,
      TableRowComponent,
      OrderByPipe,
      IconDirective,
      HotnessDirective
    ],
    providers: [
      WeatherService,
      PositionService,
      DataStorageService,
      PositionCheckService,
      RxService,
      MarkerService
    ],
    bootstrap: [IndexComponent]
})
export class IndexModule { }
