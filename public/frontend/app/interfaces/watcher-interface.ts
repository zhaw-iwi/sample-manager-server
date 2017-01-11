export interface WatcherInterface {
  onChange<T>(subscriptionName:string,value:T):void;
}
