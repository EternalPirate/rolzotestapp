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

  /**
   * Initiate MathJax library with the configuration
   */
  private static initMathJaxConfig(): void {
    MathJax.Hub.Config({
      showMathMenu: false,
      tex2jax: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
      menuSettings: { zoom: 'Double-Click', zscale: '150%' },
      CommonHTML: { linebreaks: { automatic: true } },
      'HTML-CSS': { linebreaks: { automatic: true } },
      SVG: { linebreaks: { automatic: true } }
    });
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
    MathjaxComponent.initMathJaxConfig();
  }

  /**
   * Render text using MathJax library
   */
  private renderMathJax(): void {
    this.isLoading = true;

    // wait for text rendered update
    setTimeout(() => {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub], 'MathJax');

      // hide loader when mathJax will finish calculations
      const mathJaxCallBack = () => {
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      };
      MathJax.Hub.Queue(mathJaxCallBack);
    });
  }
}
