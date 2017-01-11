import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
import {Input} from 'angular2/core';
import {SharedService} from '../../services/shared-service';
import {WatcherInterface} from '../../interfaces/watcher-interface';

@Component({
  selector: 'home',
  templateUrl: 'app/components/home/home.html',
  styleUrls: ['app/components/home/home.css'],
  styles: [],
  providers: [],
  directives: [],
  pipes: []
})

export class Home implements WatcherInterface{

  private _router:Router;
  public authorized:boolean = false;

  constructor(router:Router, private _sharedService:SharedService) {
    this._router = router;
  }

  ngOnInit() {
    this._sharedService.subscribe('loginStatus', this);
    this.authorized = this._sharedService.loggedIn;
  }

  ngOnDestroy() {
    //this._sharedService.unsubscribe('loginStatus', this);
  }

  onChange<boolean>(subscriptionName:string, value:boolean):void {
    this.authorized = value;
  }

  public openOverlay() {
    $('.ripple').addClass("rippling");
    $('.button-wrapper').addClass("clicked").delay(1500).queue(function () {
      $('.layered-content').show();
      $('.layered-content').addClass("active");
    });
  }

  public closeOverlay() {
      $('.button-wrapper').removeClass("clicked");
      $('.ripple').removeClass("rippling");
      $('.layered-content').removeClass("active");
    $('.layered-content').hide();
  }


}
