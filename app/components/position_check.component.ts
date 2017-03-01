import '../interfaces/position.interface';
import '../interfaces/weather.interface';

import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnChanges } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { PositionService } from '../services/position.service';
import { WeatherService } from '../services/weather.service';
import { DataStorageService } from '../services/data_storage.service';
import { PositionCheckService } from '../services/position_check.service';
import { template } from '../templates/position_check.template';


@Component({
    selector: 'position-check',
    changeDetection: ChangeDetectionStrategy.OnPush,
    // providers: [PositionService, PositionCheckService, WeatherService],
    template: template
})

export class PositiopCheckerComponent implements OnInit, OnChanges{

    subscription: Subscription;

    @Input() date: Date;
    @Input() curentCity: IDataListItem;
    @Input() format: string;

    constructor(
        public tpositionService: PositionService,
        public tPositionCheckService: PositionCheckService,
        private tDataStorageService: DataStorageService,
        public tWeatherService: WeatherService,
        private cd: ChangeDetectorRef
    ) {
      this.subscription = this.tDataStorageService.location$.subscribe(value => {
        this.curentCity.name = value.formatted_address;
        this.cd.markForCheck();
        // console.log(value.formatted_address);
      });
    }

    ngOnInit(){
    }

    ngOnChanges(){
    }
}
