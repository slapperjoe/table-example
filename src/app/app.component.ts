import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MoneyData } from '../models/money';
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
  monies$: Observable<MoneyData[]>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    this.monies$ = this.http.get('/assets/money.json').pipe(
      map((res: JsonArray) => DeserializeArray(res, MoneyData)),
      tap(res => console.log(res))
    );
  }
}
