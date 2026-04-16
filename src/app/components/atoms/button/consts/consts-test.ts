import { ITestCaseVariations } from "../models/button";

export const BOOLEAN_TRUE = true;
export const BOOLEAN_FALSE = false;
export const DOM_ROLE = 'button';
export const VARIATION_FILLED = 'filled';
export const LABEL_TEXT = 'label';

export const ATTRS_DISABLED = {
    DISABLED: 'disabled',
    ARIA_DISABLED: 'aria-disabled'
} as const;

export const TEST_CASE_VARIATIONS: ITestCaseVariations[] = [
    { type: 'filled', expected: 'mat-mdc-unelevated-button' },
    { type: 'outlined', expected: 'mat-mdc-outlined-button' },
    { type: 'elevated', expected: 'mat-mdc-raised-button' },
    { type: 'tonal', expected: 'mat-tonal-button' }
] as const;

export const EVENTS = {
    CLICK: 'clicked'
} as const;