import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';


declare const MathJax: any;

@Component({
  selector: 'app-mathjax',
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.scss']
})
export class MathjaxComponent implements OnInit, OnChanges {
  @Input() content: string;


  constructor() {

  }

  ngOnInit(): void {
    this.loadMathConfig();
    this.renderMath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this.renderMath();
    }
  }


  renderMath(): void {
    setTimeout(() => {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub], 'mathContent');
    }, 1000);
  }

  loadMathConfig(): void {
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
