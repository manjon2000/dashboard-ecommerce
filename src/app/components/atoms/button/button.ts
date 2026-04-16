import { Component, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { TButtonTypes } from "./models/button";
import { Appearance } from "./directives/appearance";

@Component({
    selector: 'ui-button',
    templateUrl: './button.html',
    styleUrl: './button.scss',
    imports: [
        MatButtonModule,
        Appearance
    ]
})
export class ButtonComponent {
    type = input.required<TButtonTypes>();
    label = input.required<string>();
    isDisabled = input<boolean>(false);
    clicked = output<void>();

    onClick(event: Event): void {
        this.clicked.emit();
    }
    
}