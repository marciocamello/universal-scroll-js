import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import UniversalScrollbar from 'universal-scrollbar';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scrollRef') scrollRef!: ElementRef<HTMLDivElement>;
  private scrollbar: UniversalScrollbar | null = null;
  lines = Array.from({ length: 25 }, (_, i) => i + 1);

  ngAfterViewInit(): void {
    const el = this.scrollRef?.nativeElement;
    if (el) {
      setTimeout(() => {
        this.scrollbar = new UniversalScrollbar({
          target: el,
          autoHide: false,
          thumbColor: '#667eea',
        });
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.scrollbar?.destroy();
  }
}
