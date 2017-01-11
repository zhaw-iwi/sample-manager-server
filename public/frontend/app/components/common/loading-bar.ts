import {Component} from 'angular2/core';
import {Input} from 'angular2/core';

@Component({
  selector: 'loading-bar',
  template: `
  <div class="progress" *ngIf="trigger">
      <div class="indeterminate"></div>
  </div>
  `,
  styles: [ `
    position: fixed;
    top: 0px;
  `],
  providers: [],
  directives: [],
  pipes: []
})

export class LoadingBar {

  @Input('smTrigger') trigger: boolean;
  constructor() {
  }

}
