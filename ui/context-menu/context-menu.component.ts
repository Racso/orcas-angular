import { Component, input, output, ElementRef, HostListener, booleanAttribute, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'context-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if ($isVisible() || $isSubmenu()) {
    <div 
      #container
      [class.fixed]="!$isSubmenu()"
      [class.absolute]="$isSubmenu()"
      [class.left-full]="$isSubmenu()"
      [class.top-0]="$isSubmenu()"
      [class.ml-[-2px]]="$isSubmenu()"
      class="bg-white dark:bg-[#2a2a2a] border border-light-border dark:border-dark-border rounded shadow-lg z-50 min-w-[200px] text-light-text-primary dark:text-dark-text-primary py-1"
      [style.left.px]="!$isSubmenu() ? $x() : null" 
      [style.top.px]="!$isSubmenu() ? $y() : null" 
      [style.visibility]="$isMeasuring() ? 'hidden' : 'visible'"
      (click)="$event.stopPropagation()">
      <ng-content></ng-content>
    </div>
    }
  `
})
export class ContextMenuComponent {
  $isSubmenu = input(false, { transform: booleanAttribute });

  $isVisible = signal(false);
  $isMeasuring = signal(false);
  $x = signal(0);
  $y = signal(0);

  @ViewChild('container') container?: ElementRef<HTMLDivElement>;

  close = output<void>();

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.$isSubmenu()) return;

    // If visible and click is outside, close
    if (this.$isVisible() && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  show(x: number, y: number) {
    if (this.$isSubmenu()) return;

    this.$x.set(x);
    this.$y.set(y);
    this.$isMeasuring.set(true);
    this.$isVisible.set(true);

    // Wait for DOM to render the menu so we can measure it
    setTimeout(() => {
      if (this.container) {
        const rect = this.container.nativeElement.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let newX = x;
        let newY = y;

        if (x + width > windowWidth)
          newX = x - width;

        if (y + height > windowHeight)
          newY = y - height;

        // Final safety check to ensure it doesn't go off the top/left edges
        this.$x.set(Math.max(0, newX));
        this.$y.set(Math.max(0, newY));
      }
      this.$isMeasuring.set(false);
    }, 0);
  }

  hide() {
    this.$isVisible.set(false);
    this.$isMeasuring.set(false);
  }

  private closeMenu() {
    this.hide();
    this.close.emit();
  }
}
