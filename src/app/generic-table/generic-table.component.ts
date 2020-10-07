import { Component, OnInit, Input } from '@angular/core';
import { tableSymbol } from './decorators/column.decorator';
import { ColumnModel } from './models/column.model';
import { TableModel } from './models/table.model';
import { cloneDeep, orderBy, sortBy } from 'lodash';
import { Sort, SortDirection } from '@angular/material/sort';

@Component({
  selector: 'app-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.less'],
})
export class GenericTableComponent implements OnInit {
  private pData: any[];
  private pOriginalData: any[] = [];
  private pTableModel: TableModel;

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

  constructor() {}

  ngOnInit(): void {}

  sortData(params: Sort): void {
    const direction: SortDirection = params.direction;
    this.data = direction
      ? orderBy(this.data, [params.active], [direction])
      : this.pOriginalData;
  }

  private buildColumns(): void {
    this.columns = this.pTableModel.columns;
    this.sortColumns();
    this.displayedColumns = this.columns.map(col => col.key);
  }

  private sortColumns(): void {
    this.columns = sortBy(this.columns, ['order']);
  }
}
