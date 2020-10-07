export class ColumnModel {
  /** List of options */
  key: string;
  order: number;
  propertyType: string;
  canSort: boolean;

  constructor(options: Partial<ColumnModel> = {}) {
    this.key = options.key;
    this.order = options.order || 0;
    this.propertyType = options.propertyType;
    this.canSort = options.canSort || false;
  }
}
