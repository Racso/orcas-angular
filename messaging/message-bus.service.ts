import { Injectable, DestroyRef, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface BusMessage {
    event: string;
    payload: any;
}

@Injectable({ providedIn: 'root' })
export class MessageBusService {
    private subject = new Subject<BusMessage>();

    emit<T>(event: string, payload: T): void {
        this.subject.next({ event, payload });
    }

    on<T>(event: string): Observable<T> {
        return this.subject.pipe(
            filter(msg => msg.event === event),
            map(msg => msg.payload as T)
        );
    }

    onAuto<T>(event: string, handler: (payload: T) => void): void {
        const destroyRef = inject(DestroyRef);
        const subscription = this.on<T>(event).subscribe(handler);
        destroyRef.onDestroy(() => subscription.unsubscribe());
    }
}
