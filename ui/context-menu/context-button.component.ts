import { Component, input, signal, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'context-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative" (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
      <button 
        class="w-full text-left px-3 py-2 text-sm transition-colors duration-100 flex items-center justify-between gap-2"
        [class.hover:bg-light-bg-secondary]="!disabled()"
        [class.dark:hover:bg-[#383838]]="!disabled()"
        [class.text-red-500]="danger() && !disabled()"
        [class.hover:bg-red-500]="danger() && !disabled()"
        [class.hover:text-white]="danger() && !disabled()"
        [class.opacity-50]="disabled()"
        [class.cursor-not-allowed]="disabled()"
        [disabled]="disabled()">
        <div class="flex items-center gap-2">
          <ng-content select="[icon]"></ng-content>
          <ng-content></ng-content>
        </div>
        @if (hasSubmenu()) {
          <span class="text-[10px] text-light-text-secondary opacity-50">▶</span>
        }
      </button>

      @if (hasSubmenu() && $showSubmenu() && !disabled()) {
        <div class="absolute left-full top-0 ml-[-2px] z-[60]">
          <ng-content select="context-menu"></ng-content>
        </div>
      }
    </div>
  `
})
export class ContextButtonComponent {
  danger = input(false, { transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  hasSubmenu = input(false, { transform: booleanAttribute });

  $showSubmenu = signal(false);

  onMouseEnter() {
    if (this.hasSubmenu() && !this.disabled()) {
      this.$showSubmenu.set(true);
    }
  }

  onMouseLeave() {
    if (this.hasSubmenu() && !this.disabled()) {
      this.$showSubmenu.set(false);
    }
  }
}
