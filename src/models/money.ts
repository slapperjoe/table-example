import { autoserializeAs } from 'cerializr';
import { Column } from '../app/generic-table/decorators/column.decorator';

// export class Money extends Number {}

export class MoneyData {
  @autoserializeAs(Number)
  id: number;

  @autoserializeAs(String)
  @Column({
    order: 0,
    canSort: true
  })
  label: string;

  @autoserializeAs(Number)
  @Column({
    order: 1,
    canSort: true,
    includeInTotal: true
  })
  money1: number;

  @autoserializeAs(Number)
  @Column({
    order: 2,
    canSort: true,
    includeInTotal: true
  })
  money2: number;

  @autoserializeAs(Number)
  @Column({
    order: 3,
    canSort: true,
    editable: true,
    includeInTotal: true
  })
  money3: number;

  @autoserializeAs(Number)
  @Column({
    order: 4,
    canSort: true,
    includeInTotal: true
  })
  money4: number;

}
