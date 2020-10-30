import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatInputCommifiedDirective } from './generic-table/matMoneyInput';
import {NumberInputDirective} from './number-input.directive';

@NgModule({
  declarations: [
    AppComponent,
    GenericTableComponent,
    MatInputCommifiedDirective,
    NumberInputDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
