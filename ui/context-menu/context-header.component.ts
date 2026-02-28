import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'context-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div 
      class="px-3 py-1.5 text-xs font-semibold text-light-text-secondary dark:text-dark-text-secondary truncate border-b border-light-border dark:border-dark-border mb-1">
      <ng-content></ng-content>
    </div>
  `
})
export class ContextHeaderComponent { }
