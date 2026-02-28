import {Directive, HostListener} from '@angular/core';
import {NavigationStackService} from './navigation-stack.service';

@Directive({
    selector: '[back-on-click]',
    standalone: true
})
export class BackOnClickDirective {
    constructor(private navigationStack: NavigationStackService) {
    }

    @HostListener('click', ['$event'])
    onClick(event: Event): void {
        if (event)
            event.preventDefault();

        this.navigationStack.goBack();
    }
}
