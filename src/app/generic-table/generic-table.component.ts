import { Component, OnInit, Input } from '@angular/core';
import { tableSymbol } from './decorators/column.decorator';
import { ColumnModel } from './models/column.model';
import { TableModel } from './models/table.model';
import { cloneDeep, orderBy, sortBy } from 'lodash';
import { Sort, SortDirection } from '@angular/material/sort';
import { InvokeFunctionExpr } from '@angular/compiler';
import { Money, MoneyData } from 'src/models/money';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.less'],
})
export class GenericTableComponent implements OnInit {
  private pData: any[];
  private pOriginalData: any[] = [];
  private pTableModel: TableModel;

  private pSingleSelect: boolean;
  private pShowTotal: boolean;
  private pEditable: boolean;
  private pStickyHeader: boolean;

  selection: SelectionModel<any>;

  @Input()
  set singleSelect(value: boolean){
    this.pSingleSelect = value;
  }
  get singleSelect(): boolean {
    return this.pSingleSelect || false;
  }

  @Input()
  set showTotal(value: boolean){
    this.pShowTotal = value;
  }
  get showTotal(): boolean {
    return this.pShowTotal || false;
  }
  @Input()
  set editable(value: boolean){
    this.pEditable = value;
  }
  get editable(): boolean {
    return this.pEditable || false;
  }
  @Input()
  set stickyHeader(value: boolean){
    this.pStickyHeader = value;
  }
  get stickHeader(): boolean {
    return this.pStickyHeader || false;
  }

  @Input() set data(values: any[]) {
    if (values) {
      this.pData = cloneDeep(values);
      this.pTableModel = this.pData[0][tableSymbol];
      this.buildColumns();
      if (!this.pOriginalData.length) {
        // Keep original order of data
        this.pOriginalData = cloneDeep(this.pData);
      }
    }
  }
  get data(): any[] {
    return this.pData;
  }

  columns: ColumnModel[];
  displayedColumns: string[];

  constructor() {
    this.selection = new SelectionModel<MoneyData>();
  }

  ngOnInit(): void {}

  rowClicked(row: MoneyData): void {
    this.selection.clear();
    this.selection.select(row);
  }

  rowUpdate(event, element, key): void {
    element[key] = event.srcElement.value;
  }

  sortData(params: Sort): void {
    const direction: SortDirection = params.direction;
    this.data = direction
      ? orderBy(this.data, [params.active], [direction])
      : this.pOriginalData;
  }

  private buildColumns(): void {
    this.columns = this.pTableModel.columns;
    if (this.showTotal){
      this.columns.push(new ColumnModel(
        {canSort: true, editable: false, key: 'Total', order: this.columns.length, propertyType: 'Money', includeInTotal: false}
      ));
    }
    this.sortColumns();
    this.displayedColumns = this.columns.map(col => col.key);
  }

  private sortColumns(): void {
    this.columns = sortBy(this.columns, ['order']);
  }
}
