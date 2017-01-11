import {BrowserXhr, HTTP_PROVIDERS} from "angular2/http";
import {Injectable, provide} from "angular2/core";

@Injectable()
export class CORSBrowserXHR extends BrowserXhr{
  build(): any{
    var xhr:any = super.build();
    xhr.withCredentials = true;
    return xhr;
  }
}
