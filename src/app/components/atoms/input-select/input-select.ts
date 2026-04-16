import { Component, ElementRef, input, model, inject, OnDestroy, signal } from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";

export interface SelectOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.html',
  standalone: true,
})
export class InputSelect implements ControlValueAccessor, MatFormFieldControl<any>, OnDestroy {

  // Signals
  readonly valueSignal = model<any>('', { alias: 'value' });
  readonly placeholderSignal = input<string>('', { alias: 'placeholder' });
  readonly disabledSignal = model<boolean>(false, { alias: 'disabled' });
  readonly options = input<SelectOption[]>([]); 
  readonly focusedSignal = signal<boolean>(false);
  readonly touchedSignal = signal<boolean>(false);

  get value() { return this.valueSignal(); }
  set value(val: any) { this.valueSignal.set(val); }

  get placeholder() { return this.placeholderSignal(); }
  get disabled() { return this.disabledSignal(); }
  get focused() { return this.focusedSignal(); }
  get empty() { 
    const val = this.valueSignal();
    return val === '' || val === null || val === undefined; 
  }
  get shouldLabelFloat() { return this.focusedSignal() || !this.empty; }

  stateChanges = new Subject<void>();
  static nextId = 0;
  readonly id = `input-select-${InputSelect.nextId++}`;
  
  readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly elementRef = inject(ElementRef);

  constructor() {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }
    required!: boolean;
    errorState!: boolean;
    controlType?: string | undefined;
    autofilled?: boolean | undefined;
    userAriaDescribedBy?: string | undefined;
    disableAutomaticLabeling?: boolean | undefined;
    describedByIds?: string[] | undefined;

  writeValue(value: any): void {
    this.valueSignal.set(value ?? '');
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void { 
    this.disabledSignal.set(isDisabled);
    this.stateChanges.next();
  }

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  onChangeEvent(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.valueSignal.set(val);
    this.onChange(val);
    this.stateChanges.next();
  }

  onBlur() {
    this.focusedSignal.set(false);
    this.onTouched();
    this.stateChanges.next();
  }

  onFocus() {
    this.focusedSignal.set(true);
    this.stateChanges.next();
  }

  setDescribedByIds(ids: string[]): void {}

  onContainerClick(): void {
    this.elementRef.nativeElement.querySelector('select')?.focus();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }
}