import { ChangeDetectorRef, Component, Input } from '@angular/core';


declare const MathJax: any;

@Component({
  selector: 'app-mathjax',
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.scss']
})
export class MathjaxComponent {
  content: string;
  @Input() set preview(preview: string) {
    if (preview) {
      this.content = preview;
      this.renderMathJax();
    }
  }

  isLoading = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.initMathJaxConfig();
  }

  private renderMathJax(): void {
    this.isLoading = true;

    // wait for text rendered update
    setTimeout(() => {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub], 'MathJax');

      const mathJaxCallBack = () => {
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      };
      MathJax.Hub.Queue(mathJaxCallBack);
    });
  }

  private initMathJaxConfig(): void {
    MathJax.Hub.Config({
      showMathMenu: false,
      tex2jax: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
      menuSettings: { zoom: 'Double-Click', zscale: '150%' },
      CommonHTML: { linebreaks: { automatic: true } },
      'HTML-CSS': { linebreaks: { automatic: true } },
      SVG: { linebreaks: { automatic: true } }
    });
  }
}
