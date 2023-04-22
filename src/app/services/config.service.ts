import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigSite } from '../models/generic';
import { Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private _http: HttpClient) { }

  GetConfig(): Observable<ConfigSite> {
    return this._http.get("../../assets/config.json").pipe(// Always load the json without cache.
      map((response: ConfigSite) => <ConfigSite>response),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  }
}
