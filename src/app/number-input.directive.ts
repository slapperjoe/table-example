// @ts-nocheck
import { Directive, forwardRef, Output, EventEmitter } from '@angular/core';

import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';

import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CurrencyMaskDirective, CurrencyMaskInputMode } from 'ngx-currency';

@Directive({
  selector: 'input[numberInput]',
  providers: [{
    provide: MAT_INPUT_VALUE_ACCESSOR,
    useExisting: NumberInputDirective,
  },
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberInputDirective),
    multi: true,
  }]
})
export class NumberInputDirective extends CurrencyMaskDirective {
  ngOnInit(): void {
    super.ngOnInit();

    // @ts-ignore
    const iS = this.inputHandler.inputService;

    this.inputHandler.onModelChange = () => { };
    this.inputHandler.onModelTouched = () => { };

    iS.applyMask = (isNumber: boolean, rawValue: string, disablePadAndTrim = false): string => {
      // tslint:disable-next-line:prefer-const
      let { allowNegative, decimal, precision, prefix, suffix, thousands, min, max, inputMode } = iS.options;

      rawValue = isNumber ? Number(rawValue).toFixed(precision) : rawValue;
      let onlyNumbers = rawValue.replace(iS.ONLY_NUMBERS_REGEX, '');

      if (!onlyNumbers && rawValue !== decimal) {
        return '';
      }

      if (inputMode === CurrencyMaskInputMode.NATURAL && !isNumber && !disablePadAndTrim) {
        rawValue = iS.padOrTrimPrecision(rawValue);
        onlyNumbers = rawValue.replace(iS.ONLY_NUMBERS_REGEX, '');
      }

      let integerPart = onlyNumbers.slice(0, onlyNumbers.length - precision)
        .replace(/^\u0660*/g, '')
        .replace(/^\u06F0*/g, '')
        .replace(/^0*/g, '');

      if (integerPart === '') {
        integerPart = '0';
      }

      // Ensure max is at least as large as min.
      max = (iS.isNullOrUndefined(max) || iS.isNullOrUndefined(min)) ? max : Math.max(max, min);
      if (max !== undefined && max <= 0) {
        if (integerPart === '0') {
          integerPart = (max - 1).toString();
        } else {
          let neg = -Math.abs(integerPart);
          if (min !== undefined && neg <= min) {
            neg = min;
            onlyNumbers = integerPart.toString().padEnd(integerPart.length + precision, '0');
          }
          integerPart = neg.toString();
        }
        const splitSet = rawValue.split(prefix);
        splitSet[splitSet.length - 1] = iS.padOrTrimPrecision(Number(integerPart).toFixed(precision));
        rawValue = `${prefix}${splitSet.join('')}`;
        integerPart = Math.abs(integerPart).toString();
      }
      const integerValue = parseInt(integerPart, precision);

      integerPart = integerPart.replace(/\B(?=([0-9\u0660-\u0669\u06F0-\u06F9]{3})+(?![0-9\u0660-\u0669\u06F0-\u06F9]))/g, thousands);
      if (thousands && integerPart.startsWith(thousands)) {
        integerPart = integerPart.substring(1);
      }

      let newRawValue = integerPart;
      const decimalPart = onlyNumbers.slice(onlyNumbers.length - precision);
      const decimalValue = parseInt(decimalPart, precision) || 0;

      const isNegative = rawValue.indexOf('-') > -1;

      if (isNegative && (suffix === '' || (suffix.length > 0 && suffix.charAt(0) !== ')'))) {
        suffix = ')' + suffix;
      }

      // Restrict to the min and max values.
      let newValue = integerValue + (decimalValue / 100);
      newValue = isNegative ? -newValue : newValue;
      if (!iS.isNullOrUndefined(max) && newValue > max) {
        return iS.applyMask(true, max + '');
      } else if (!iS.isNullOrUndefined(min) && newValue < min) {
        return iS.applyMask(true, min + '');
      }

      if (precision > 0) {
        if (newRawValue === '0' && decimalPart.length < precision) {
          newRawValue += decimal + '0'.repeat(precision - 1) + decimalPart;
        } else {
          newRawValue += decimal + decimalPart;
        }
      }

      const isZero = newValue === 0;
      const operator = (isNegative && allowNegative && !isZero) ? '(' : '';
      return operator + prefix + newRawValue + suffix;
    };
  }
}
