///<reference path="./../node_modules/angular2/typings/tsd.d.ts"/>

import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {BrowserXhr} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {SampleManagerApp} from './app/sample-manager-app';
import {HttpService} from './app/services/http-service';
import {CORSBrowserXHR} from './app/services/cors-browser-xhr';
import {provide} from 'angular2/core';
import {HashLocationStrategy} from 'angular2/router';
import {LocationStrategy} from 'angular2/router';
import {SharedService} from './app/services/shared-service';
import TRANSLATE_PROVIDERS from 'ng2-translate/ng2-translate';
import {TranslateLoader} from 'ng2-translate/ng2-translate';
import {TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {Http} from 'angular2/http';

bootstrap(SampleManagerApp, [
  HTTP_PROVIDERS,
  provide(BrowserXhr, {useClass: CORSBrowserXHR}),
  ROUTER_PROVIDERS,
  HttpService,
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  SharedService,
  provide(TranslateLoader, {
    useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
    deps: [Http]
  })
]).catch(err => console.error(err));
