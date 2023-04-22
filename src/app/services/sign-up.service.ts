import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigSite } from '../models/generic';
import { Observable, throwError} from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { Comunication, Country, Currency, Document, GetSite, IsoCodeCountryModel, LineTypeModel, LocationDto, QuickSignUpDto, QuickSignUpResult, RequestSiteByPlayerForCountryCurrency, SignUpMessage, SignUpMessageRequest, SiteByPlayerForCountryCurrency, State } from '../models/signUp';
import { sha256 } from 'js-sha256';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private characters: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

  constructor(private _http: HttpClient) { }

  getIdSite(apiUrl: string, urlSite: string): Observable<number> {
      return this._http.get(apiUrl + "SignUpAdministrator/getIdSiteDomain?siteDomain=" + urlSite).pipe(
      map((resp: number) => <number>resp),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  }

  getServiceGeoLocation(apiUrl: string, apiToken: string): Observable<LocationDto> {
    return this._http.get(apiUrl.trim()+apiToken.trim()).pipe(
      map((resp: LocationDto) => <LocationDto>resp),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  }

  getCountry(apiUrl: string): Observable<Country[]> {
    return this._http.get(apiUrl + 'SignUpAdministrator/getCountryForSignUp').pipe(
      map((resp: Country[]) => <Country[]>resp),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  };

  getCurrenciesBySiteAndCountry(apiUrl: string, siteDomain: string, idCountry: string): Observable<Currency[]> {
    return this._http.get(apiUrl + 'SignUpAdministrator/getCurrenciesBySiteDomainCountry?siteDomain=' + siteDomain + '&idCountry=' + idCountry).pipe(
      map((resp: Currency[]) => <Currency[]>resp),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  };

  getState(apiUrl: string, idCountry: string): Observable<State[]> {
    return this._http.get(apiUrl + 'SignUpAdministrator/GetCountryStates?idCountry=' + idCountry).pipe(
      map((resp: State[]) => <State[]>resp),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  };

  GetLineTypesByCountry(apiUrl: string, IdSite: number, IsoCountry: string): Observable<LineTypeModel[]> {
    let apiMethod: string = 'SignUpAdministrator/GetLineTypesByCountry?IdSite=' + IdSite + '&IsoCountry=' + IsoCountry;
    return this._http.get(apiUrl + apiMethod).pipe(
      map((resp: LineTypeModel[]) => <LineTypeModel[]>resp),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  };

  GetCountryCode(): Observable<IsoCodeCountryModel> {
    return this._http.get("../../assets/Json/CodeCountry.json").pipe(
      map((response: IsoCodeCountryModel) => <IsoCodeCountryModel>response),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  } //end function

  GetDocumentsClaims(apiUrl: string, idSite: number ): Observable<Document[]> {
    return this._http.get(apiUrl + 'SignUpAdministrator/GetDocumentsClaims?idSite='+idSite).pipe(
      map((res: Document[]) => <Document[]>res),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  } 

  GetSignUpMessage(apiUrl: string, req: SignUpMessageRequest): Observable<SignUpMessage> {
    return this._http.post(apiUrl + 'SignUpAdministrator/GetSignUpMessage', req).pipe(
      map((resp: SignUpMessage) => <SignUpMessage>resp),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  }

  SendImages(apiUrl: string, req: GetSite): Observable<boolean> {
    return this._http.post(apiUrl + 'SignUpAdministrator/GetImageDataForNotification', req).pipe(
      map((resp: boolean) => <boolean>resp),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  };

  getColumnsBySiteCountryCurrency(apiUrl: string, requestColumnsPlayer: RequestSiteByPlayerForCountryCurrency): Observable<SiteByPlayerForCountryCurrency[]> {
    let apiMethod: string = 'SignUpAdministrator/ColumnsBySitePlayerCountryCurrency';
    return this._http.post(apiUrl + apiMethod, requestColumnsPlayer).pipe(
      map((resp: SiteByPlayerForCountryCurrency[]) => <SiteByPlayerForCountryCurrency[]>resp),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  }

  SendComunicationInfo(apiUrl: string, comunication: Comunication): Observable<boolean> {
    return this._http.post(apiUrl + 'SignUpAdministrator/InsertComunicationParams', comunication).pipe(
      map((resp: boolean) => <boolean>resp),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))));
  }

  QuickPlayerInsert(apiUrl: string, t: QuickSignUpDto): Observable<QuickSignUpResult> {

    let apiMethod: string = 'SignUpAdministrator/QuickPlayerInsert';

    return this._http.post(apiUrl + apiMethod, t, { headers: this.GetHeaders(t.IP, t.SiteDomain) }).pipe(
      map((resp: QuickSignUpResult) => <QuickSignUpResult>resp),
      catchError((error: any) => throwError(() => new Error(error || 'Server Error'))),
      timeout(300000))
  }


  private GetHeaders(ip: string, siteDomain: string): HttpHeaders {
    var token: string = sha256(ip + ":&:" + siteDomain);
    var x = window.location.hostname;
    var encode = btoa(this.characters[(Math.floor(Math.random() * (35 - 0)) + 0)] + token + this.characters[(Math.floor(Math.random() * (35 - 0)) + 0)]);
    return new HttpHeaders({ 'Authorization': 'bearer ' + encode });
  }


}
