import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Car } from '../models/car';
import { Money, MoneyData } from '../models/money';
import { Observable } from 'rxjs';
import { DeserializeArray } from 'cerializr';
import { JsonArray } from 'cerializr/dist/interfaces';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  cars$: Observable<Car[]>;

  monies$: Observable<MoneyData[]>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // this.cars$ = this.http.get('/assets/car.json').pipe(
    //   map((res: JsonArray) => DeserializeArray(res, Car)),
    //   tap(res => console.log(res))
    // );

    this.monies$ = this.http.get('/assets/money.json').pipe(
      map((res: JsonArray) => DeserializeArray(res, MoneyData)),
      tap(res => console.log(res))
    );
  }
}
