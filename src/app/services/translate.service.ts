import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(private _http: HttpClient) { 
  }

  /**  
   * @param lang 
   * @returns 
   */
  public getTranslation(lang: string): Observable<any> {
      return this._http.get(`../assets/i18n/${lang}.json`).pipe(map((response: any) => <any>response), catchError(this.handleError));
  }

  private handleError(error: Response) {
      return throwError(error.json() || 'Server Error');
  }


}
