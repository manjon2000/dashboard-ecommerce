import { Component, ElementRef, inject, input, model, OnDestroy, signal } from "@angular/core";
import { ControlValueAccessor, NgControl } from "@angular/forms";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";

@Component({
    selector: 'app-input-text',
    templateUrl: './input-text.html',
})
export class InputText implements ControlValueAccessor, MatFormFieldControl<string>, OnDestroy {

    readonly valueSignal = model<string>('', { alias: 'value' });
    readonly placeholderSignal = input<string>('', { alias: 'placeholder' });
    readonly disabledSignal = model<boolean>(false, { alias: 'disabled' });
    readonly focusedSignal = signal<boolean>(false);
    readonly touchedSignal = signal<boolean>(false);

    get value() { return this.valueSignal(); }
    set value(val: string) { this.valueSignal.set(val); }

    get placeholder() { return this.placeholderSignal(); }
    get disabled() { return this.disabledSignal(); }
    get focused() { return this.focusedSignal(); }
    get empty() { return !this.valueSignal(); }
    get shouldLabelFloat() { return this.focusedSignal() || !this.empty; }

    stateChanges = new Subject<void>();
    static nextId = 0;
    readonly id = `input-text-${InputText.nextId++}`;

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

    writeValue(value: string): void {
        this.valueSignal.set(value || '');
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    
    registerOnTouched(fn: any): void { 
        this.onTouched = fn;
     }

    setDisabledState(isDisabled: boolean): void {
        this.disabledSignal.set(isDisabled);
        this.stateChanges.next();
    }

    onChange: (value: string) => void = () => {};
    onTouched: () => void = () => {};

    onInput(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
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
        this.elementRef.nativeElement.querySelector('input')?.focus();
    }

    ngOnDestroy() {
        this.stateChanges.complete();
    }
}