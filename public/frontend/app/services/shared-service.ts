import {Injectable} from 'angular2/core';
import {WatcherMap} from '../interfaces/watcher-map';
import {WatcherInterface} from '../interfaces/watcher-interface';


@Injectable()
export class SharedService {

  public loggedIn:boolean = false;
  private subscriptions:WatcherMap = {};

  constructor() {
  }

  public notify<T>(subscriptionName:string, value:T) {
    let subscriptions = this.subscriptions[subscriptionName];
    if (subscriptions) {
      for (let i = 0; i < subscriptions.length; i++) {
        subscriptions[i].onChange<T>(subscriptionName, value);
      }
    } else {
      return;
    }
  }

  public subscribe(subscriptionName:string, watcher:WatcherInterface) {
    if (this.subscriptions[subscriptionName]) {
      this.subscriptions[subscriptionName].push(watcher)
    } else {
      this.subscriptions[subscriptionName] = [watcher];
    }
  }

  public unsubscribe(subscriptionName:string, watcher:WatcherInterface) {
    if (this.subscriptions[subscriptionName]) {
      this.subscriptions[subscriptionName].splice(this.subscriptions[subscriptionName].indexOf(watcher), 1)
    }
  }

  public getIconByType(type:string):string {
    switch (type) {
      case 'select_one':
            return 'done';
      case 'select_many':
            return 'done_all';
      case 'likert_scale':
            return 'stars';
      case 'visual_analog_scale':
            return 'linear_scale';
      case 'rating':
            return 'stars';
      case 'frequency':
            return 'replay';
      case 'yes_no':
      case 'open':
            return 'help_outline';
      case 'location':
            return 'my_location';
      case 'volume':
            return 'hearing';
      case 'and':
            return 'call_merge';
      case 'or':
            return 'call_split';
      case 'random':
            return 'all_inclusive';
      case 'timer':
        return 'alarm';
      case 'place':
            return 'place';
      case 'social':
        return 'group';
      case 'health':
        return 'favorite';
      case 'external':
        return 'power';

    }
  }
}
