import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
  animations: [
    (trigger('moveHeading', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('1000ms ease-in', style({ transform: 'translateY(0%)' })),
      ]),
    ]))
  ]
})
export class NotFoundComponent {
  animateHeading = false;
  ngOnInit() {
    this.triggerAnimation();
  }
  triggerAnimation() {
    this.animateHeading = true;
  }
}
