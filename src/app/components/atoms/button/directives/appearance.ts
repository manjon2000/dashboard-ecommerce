import { Directive, effect, inject, input } from "@angular/core";
import { TButtonTypes } from "../models/button";
import { MatButton, MatButtonAppearance } from "@angular/material/button";

@Directive({
    selector: 'button[mat-button][appearance]',
    standalone: true,
})
export class Appearance {

    private matButton = inject(MatButton);
    type = input.required<TButtonTypes>();
    isDisabled = input.required<boolean>();
    
    constructor() {
        effect(() => {
            this.matButton.appearance = this.type() as MatButtonAppearance;
        });

        effect(() => {
            this.matButton.disabled         = this.isDisabled();
            this.matButton.disableRipple    = this.isDisabled();
            this.matButton.ariaDisabled     = this.isDisabled();
        });
    }
}