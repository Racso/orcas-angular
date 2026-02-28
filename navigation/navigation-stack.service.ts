import {Injectable} from '@angular/core';
import {Location} from '@angular/common';
import {Router, NavigationEnd} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NavigationStackService {
    private history: string[] = [];

    constructor(private router: Router, private location: Location) {
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd)
                this.history.push(event.urlAfterRedirects);
        });
    }

    public goBack(): void {
        this.history.pop();
        if (this.history.length > 0)
            this.location.back();
        else
            this.router.navigateByUrl("/").then();
        this.history.pop();
    }

    public getBack(): string {
        if (this.history.length > 1)
            return this.history[this.history.length - 2];

        return '';
    }
}