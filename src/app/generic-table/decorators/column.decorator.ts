import { ColumnModel } from '../models/column.model';
import { TableModel } from '../models/table.model';
import 'reflect-metadata';

export const tableSymbol = Symbol('table');

export function Column(options: Partial<ColumnModel> = {}): (t: any, p: string) => void  {
  return (target: any, propertyKey: string) => {
    if (!target[tableSymbol]) {
      target[tableSymbol] = new TableModel();
    }
    options.key = options.key || propertyKey;

    // Get the type of the property
    const propType = Reflect.getMetadata('design:type', target, propertyKey);
    options.propertyType = propType.name;

    const columnOptions = new ColumnModel(options);
    target[tableSymbol].addColumn(columnOptions);
  };
}
