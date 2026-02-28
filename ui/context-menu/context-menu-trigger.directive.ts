import { Directive, input, output, HostListener, ElementRef } from '@angular/core';
import { ContextMenuComponent } from './context-menu.component';

@Directive({
    selector: '[appContextMenu]',
    standalone: true
})
export class ContextMenuTriggerDirective {
    appContextMenu = input.required<ContextMenuComponent>();

    beforeOpen = output<void>();

    constructor(private elementRef: ElementRef) { }

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        // Notify parent to prepare data
        this.beforeOpen.emit();

        // Show menu at cursor position
        this.appContextMenu().show(event.clientX, event.clientY);
    }
}
