import {Component} from 'angular2/core';
import {User} from '../../models/user';
import {LoginRequest} from '../../models/login-request';
import {Router} from 'angular2/router';
import {Input} from 'angular2/core';

@Component({
  selector: 'loading-spinner',
  template: `
<div class="loading-spinner center-align" *ngIf="trigger">
  <div class="preloader-wrapper big active">
    <div class="spinner-layer spinner-purple-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div>
      <div class="gap-patch">
        <div class="circle"></div>
      </div>
      <div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [],
  providers: [],
  directives: [],
  pipes: []
})

export class LoadingSpinner {

  @Input('smTrigger') trigger: boolean;
  constructor() {
  }

}
