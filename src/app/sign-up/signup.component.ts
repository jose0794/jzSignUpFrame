import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { ConfigSite } from '../models/generic';

import {
  CodeCountryModel,
  Comunication,
  CookiesDto,
  Country,
  Currency,
  Document,
  GenericDataDto,
  GetSite,
  LineTypeModel,
  LocationDto,
  PlayerDto,
  QuickSignUpDto,
  QuickSignUpResult,
  RequestSiteByPlayerForCountryCurrency,
  SelectGoogleRecaptchaBySiteRquestDto,
  SignUpMessageRequest,
  SiteByPlayerForCountryCurrency,
  State,
  ValidInputsDto,
} from '../models/signUp';
import { ConfigService } from '../services/config.service';
import { SignUpService } from '../services/sign-up.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
  _domain: string;
  _currentLang: string;
  _configData: ConfigSite;
  _FormConfiguration: SiteByPlayerForCountryCurrency[];
  _Location: LocationDto;
  _signUpRequest: QuickSignUpDto = new QuickSignUpDto();
  selectedCategories: boolean = false; 
  PCodeSignUp: boolean = false; 
  //_signUpCPF: 
  _Countries: Country[];
  _IsDesktop: boolean;
  _States: State[];
  _CountriesCode: CodeCountryModel[];
  _imgCountry: string = '';
  _LineTypes: LineTypeModel[];
  _document: Document[];
  _IdLanguage: number = 0;
  _MessageSignUp: string;
  _GoogleReCaptcha: SelectGoogleRecaptchaBySiteRquestDto;
  _currentUser: PlayerDto;
  _Currencies: Currency[];
  _AccessInputs: ValidInputsDto;
  _identifyLeng: number = 0;
  _Step: number = 0;
  _CPF: boolean = false;
  _ValidateDate: boolean = false;
  _recaptchaValidation: boolean = false;
  _message: string = "";
  _model: any = {};
  _WithOutAutentification: boolean = false;
  _Comunication: boolean = true;
  _appCode: string;
  _date: Date = new Date();
  _DateOrder: boolean = false;
  _DaysDetails: GenericDataDto[];
  _MonthDetails: GenericDataDto[];
  _YearDetails: GenericDataDto[];
  _Identifications: string[] = ['CPF','CNPJ','CEP'];

  constructor(
    private route: ActivatedRoute,
    private _Config: ConfigService,
    private signupService: SignUpService,
    private _CookieService: CookieService,
    private _Translate: TranslateService,
    private _DeviceService: DeviceDetectorService
  ) {
    this.route.queryParams.subscribe((resp) => {
      this._domain = resp['domain'];
      this._currentLang = resp['lang'];
      if (this._currentLang != undefined) {
        this._Translate.use(this._currentLang)
      } else {
        this._Translate.use("en")
      }
      if(this._currentLang == "es"){
        this._DateOrder = true;
      }else{
        this._DateOrder = false;
      }
    });
  }

  ngOnInit() {
    
    this._IsDesktop = this._DeviceService.isDesktop(); // return true desktop
    this._Config.GetConfig().subscribe((data) => {
      this._configData = data;
      if (this._domain) {
        this.getIdSiteByUrl(this._domain);
      } else {
        this._domain = this._configData.DefaultHostName;
        if (this._domain) {
          this.getIdSiteByUrl(this._domain);
        }
      }
    });
  }

  //aca traigo el id del site
  getIdSiteByUrl(domain: string) {
    try {
      this.signupService
        .getIdSite(this._configData.jazzCoreApi, domain)
        .subscribe((resp) => {
          if (resp != null || resp != undefined) {
            this._configData.IdSite = resp;
            console.log(resp,"idsite")
            this.GetGeolocation();
          }
        }),
        (error) => {
          console.log('Error get IdSite');
        };
    } catch {
      console.log('Error get IdSite');
    }
  }

  GetGeolocation() {
    this.signupService
      .getServiceGeoLocation(
        this._configData.apiLocation[0].apiUrl.trim(),
        this._configData.apiLocation[0].apiToken.trim()
      )
      .subscribe((data) => {
        if (data) {
          let t: LocationDto = new LocationDto();
          (t.ip = data.ip),
            (t.city = data.city),
            (t.region_code = data.region_code),
            (t.country_code = data.country_code),
            (t.postal = data.postal),
            (t.latitude = data.latitude),
            (t.longitude = data.longitude),
            (t.region = data.region),
            (t.country = data.country),
            (t.error = data.error);
          if (t) {
            this._Location = data;
            this.GetCurrency();
          }
        } else {
          console.log('callo al else en GetGeolocation');
        }
      });
  }

  GetCountries() {
    try {
      this.signupService
        .getCountry(this._configData.jazzCoreApi)
        .subscribe((data) => {
          this._Countries = data;
          console.log('paises', data);
          this._signUpRequest.Country = this._Location.country
            ? this._Countries.find(
                (c) => c.idCountry == this._Location.country_code
              )
            : null;
          this.ChangeDataByCountry();
        }),
        (error) => {
          console.log('Error Get Countries');
        };
    } catch {
      console.log('Error Get Countries');
    }
  }

  ChangeDataByCountry() {
    this.GetLineTypesByCountry();
    this.GetStates();
    this.getDocumentsClaims();
    this.GetSignUpMessage();
    this.SetData();
  }

  GetLineTypesByCountry() {
    if (this._signUpRequest && this._signUpRequest.Country) {
      this.signupService
        .GetLineTypesByCountry(
          this._configData.jazzCoreApi,
          Number(this._configData.IdSite),
          this._signUpRequest.Country.idCountry
        )
        .subscribe((data) => {
          this._LineTypes = data.map((item) => {
            return {
              Id: item.Id,
              Name: '', //this._Translate.instant("LineType.LT_" + item.Id),
              Description: item.Description,
            };
          });
          this._signUpRequest.LineType = this._LineTypes
            ? this._LineTypes[0]
            : null; // Use first line Type default
        });
    }
  }

  getDocumentsClaims() {
    try {
      this.signupService
        .GetDocumentsClaims(
          this._configData.jazzCoreApi,
          Number(this._configData.IdSite)
        )
        .subscribe((resp) => {
          this._document = resp;
          if (this._document) {
            //console.log(this._document, "aca estan los Documents")
          }
        }),
        (error) => {
          console.log('Error get Documents');
        };
    } catch {
      console.log('Error Documents');
    }
  }

  GetStates() {
    if (this._signUpRequest && this._signUpRequest.Country) {
      this.GetCountryCodeByIdIso(this._signUpRequest.Country.idCountry);
      this.signupService
        .getState(
          this._configData.jazzCoreApi,
          this._signUpRequest.Country.idCountry
        )
        .subscribe((data) => {
          this._States = data;
        });
    }
  }

  GetCountryCode() {
    this.signupService.GetCountryCode().subscribe(
      (c) => {
        this._CountriesCode = c.countries;
        this.GetCountries();
        this.GetCountryCodeByIdIso(this._Location.country_code);
      },
      (error) => {
        this._Step = 3; // Go error
      }
    );
  }

  GetCurrency() {
    console.log(this._domain, this._Location, 'testGeolocation');
    this.signupService
      .getCurrenciesBySiteAndCountry(
        this._configData.jazzCoreApi,
        this._domain,
        this._Location.country_code
      )
      .subscribe((data) => {
        if (data) {
          console.log(data, 'LOLLLL');
          this._Currencies = data;
          if (this._Currencies != null) {
            this.GetCountryCode()
            this.GetSigUpConfig();
          }
          // if (Number(this._configData.IdSite) == 794) {
              // this._signUpRequest.Currency = curren; // Select first currency
          //     this.GetSigUpConfig();
          // } else {
          //     //this._signUpRequest.Currency = curren; // Select first currency
          //     this.GetSigUpConfig();
          // }
        } else {
          console.log('Error when get the currencys');
        }
      });
    (error) => {
      //this._Step = 3; // Go error
    };
  }

  GetSigUpConfig() {
     if (this._Currencies) {
       let req: RequestSiteByPlayerForCountryCurrency = {
         siteTag: this._domain,
         idCountry: this._Location.country_code,
         idCurrency: this._Currencies[0].idCurrency,
       };
       this.signupService.getColumnsBySiteCountryCurrency(this._configData.jazzCoreApi, req).subscribe(
           (data) => {
             console.log('requiereColumns', data, req);
             this._FormConfiguration = data;
             this._FormConfiguration.forEach(element => {
                if(element.name == 'CPF'){
                  this._CPF = true;
                }
              });
             this.CheckAccessConfig();
             this.identificationSites();
           }),
           (error) => {
             this._Step = 3; // Go error
           }
     } else {
       this._Step = 3; // Go error
     }
  }

  identificationSites() {
    if (
      Number(this._configData.IdSite) == 761 ||
      Number(this._configData.IdSite) == 794 ||
      Number(this._configData.IdSite) == 773
    ) {
      this._identifyLeng = 1;
    } else if (
      Number(this._configData.IdSite) == 599 ||
      Number(this._configData.IdSite) == 902
    ) {
      this._signUpRequest.GovernmentId = '';
      this._identifyLeng = 3;
    } else {
      this._identifyLeng = 3;
    }
    console.log(this._identifyLeng, '_identifyLeng');
  }

  identification() {
    if (this._signUpRequest.GovernmentId.length > 0) {
      this._signUpRequest.GovernmentId = 'V';
    } else {
      this._signUpRequest.GovernmentId = 'V' + this._signUpRequest.GovernmentId;
    }
  }

  CheckAccessConfig() {
    this._AccessInputs = new ValidInputsDto();
    if (this._FormConfiguration) {
      this._FormConfiguration.forEach((item) => {
        switch (item.name) {
          case 'Google':
            this._AccessInputs.AccessByGoogle = true;
            break;
          case 'Facebook':
            this._AccessInputs.AccessByFacebook = true;
            break;
          case 'Anonymous Account':
            this._AccessInputs.AccessAnonymousAccount = true;
            break;
          case 'Date of Birth':
            this._AccessInputs.AccessBirthDate = true;
            break;

          case 'Hear': // Use for Marketing
          case 'Promotional Code':
          case 'Referral Account':
            this._AccessInputs.AccessMarketing = true;
            break;
          case 'Poker': // Main Interests
          case 'Casino':
          case 'Racebook':
          case 'Sportsbook':
            this._AccessInputs.AccessMainInterests = true;
            break;

          case 'Terms and Conditions':
            this._AccessInputs.AccessTermsAndConditions = true;
            break;

          default:
            break;
        }
      });
    }
  }

  GetCountryCodeByIdIso(pIsoCountry: string) {
    if (this._CountriesCode) {
      this._imgCountry = '';
      let tmp = this._CountriesCode.find((c) => c.IsoContry == pIsoCountry);
      if (tmp) {
        let _img: string =
          this._configData.ImgServerPath +
          'CodeCountries/' +
          pIsoCountry.toLowerCase() +
          '.png';
        this._imgCountry = _img;
        this._signUpRequest.CountryCode = tmp.code;
      }
    }
  }

  GetSignUpMessage() {
    try {
      let SignUpMessageRequest: SignUpMessageRequest = {
        idSiteTag: Number(this._configData.IdSite),
        idLanguage: this._IdLanguage,
      };
      this.signupService
        .GetSignUpMessage(this._configData.jazzCoreApi, SignUpMessageRequest)
        .subscribe(
          (resp) => {
            if (resp) {
              console.log(resp, 'respuesta del mensageeeee');
              this._MessageSignUp = resp[0] ? resp[0].messageSite : '';
              console.log(
                resp[0] ? resp[0].messageSite : '',
                'testttttttttttt'
              );
            } else this._GoogleReCaptcha = null;
          },
          (error) => {
            console.log('Error subscribe GetGoogleRecaptchaBySiteId', {
              error,
            });
          }
        );
    } catch (error) {
      console.log('Error google analytics');
    }
  }

  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  TestIdentification() {
    console.log(this._signUpRequest.IdDocumentType);
    console.log(this._signUpRequest.GovernmentId);
  }

  /**
   * 10-10-2020
   *
   * Use for action login by site
   *
   */
  ActionLoginForSite() {
    try {
      let _encode = btoa(
        this._signUpRequest.Player + ':' + this._signUpRequest.Password
      );
      window.top.location.href =
        '//' + this._domain + '/quicklogin?access=' + _encode + '&welcome=1'; // Becasue use in iframe
      this.SendImages();
    } catch (error) {
      console.log('Error with login');
    }
  }

  SendImages() {
    if (this._currentUser) {
      let t: GetSite = new GetSite();
      t.player = this._currentUser.Player;
      t.password = this._currentUser.Password;
      t.siteDomain = this._domain;
      this.signupService
        .SendImages(this._configData.jazzCoreApi, t)
        .subscribe((resp) => {
          if (resp) {
            console.log('Send Email Images', t);
          } else {
            console.log('we can not send Email Images');
          }
        });
    }
  }

  IsValidDate() {
    try {
      if (
        this._signUpRequest &&
        this._signUpRequest.DayBirth > 0 &&
        this._signUpRequest.MonthBirth > 0 &&
        this._signUpRequest.YearBirth > 0
      ) {
        let dateString =
          this._signUpRequest.YearBirth +
          "-" +
          this._signUpRequest.MonthBirth +
          "-" +
          this._signUpRequest.DayBirth;
        this._signUpRequest.DateBirth = new Date(dateString);

        if (this._signUpRequest.DateBirth) {
          let diff = new Date().getTime() - this._signUpRequest.DateBirth.getTime();
          if (diff > 568148471175) {
            this._ValidateDate = true;
            this._AccessInputs.ValidBirth = true;//DIF IN MS => 18 YEARS
          } else {
            this._ValidateDate = false;
            this._AccessInputs.ValidBirth = false;//DIF IN MS => 18 YEARS
          }
        }
      } else this._AccessInputs.ValidBirth = false;
    } catch {
      this._AccessInputs.ValidBirth = false;
    }
  }

  EmailsMatch() {
    if (this._AccessInputs) {
      this.DeleteSpaces();
      this._AccessInputs.EmailsMatch = this._FormConfiguration
        ? this._signUpRequest.Email == this._signUpRequest.EmailConfirmation
          ? true
          : false
        : false;
    }
  }

  DeleteSpaces() {
    if (this._signUpRequest.Email)
      this._signUpRequest.Email = this._signUpRequest.Email.replace(/\s+/g, "");
    if (this._signUpRequest.EmailConfirmation)
      this._signUpRequest.EmailConfirmation =
        this._signUpRequest.EmailConfirmation.replace(/\s+/g, "");
  }

  PasswordsMatch() {
    if (this._AccessInputs)
      this._AccessInputs.PasswordMatch = this._FormConfiguration
        ? this._signUpRequest.Password ===
          this._signUpRequest.PasswordConfirmation
          ? true
          : false
        : false;
  }

  SetCookies(): CookiesDto {
    let result: CookiesDto = new CookiesDto();
    result.AffiliateCode = this._CookieService.check("affiliateCode")
      ? this._CookieService.get("affiliateCode")
      : null;
    result.BannerCode = this._CookieService.check("bannerCode")
      ? this._CookieService.get("bannerCode")
      : null;
    result.CampaignCode = this._CookieService.check("campaign")
      ? this._CookieService.get("campaign")
      : null;
    result.Mpo = this._CookieService.check("mpo")
      ? this._CookieService.get("mpo")
      : null;
    result.RedirectPageCode = this._CookieService.check("rp")
      ? this._CookieService.get("rp")
      : null;

    return result;
  }

    /************************************** CODE ERRORS SIGN UP **************************************/
  /*
   *  -1 => Generic Error
   *  -2 => Player already exist in group
   *  -3 => Config default master player is Empty
   *  -4 => Not exist Master player
   *  -5 => ErrorUpdate prefix
   *  -6 => Error sp Insert player
   */
  /************************************** CODE ERRORS SIGN UP **************************************/
  async CreateSignUp(IsValid: boolean) {

    if (this._GoogleReCaptcha && this._recaptchaValidation == false)
      return;
    this._message = '';
    this.IsValidDate();
    this._AccessInputs = new ValidInputsDto();
    if (!this._FormConfiguration.find(x => x.name == 'Email Confirmation')) {
      this._AccessInputs.EmailsMatch = true;
    } else {
      this.EmailsMatch();
      this.IsValidDate();
    }
    if (!this._FormConfiguration.find(x => x.name == 'Password Confirmation')) {
      this._AccessInputs.PasswordMatch = true;
    } else {
      this.PasswordsMatch();
      this.IsValidDate();
    }
    if (IsValid && this._signUpRequest && this._AccessInputs.EmailsMatch && this._AccessInputs.PasswordMatch &&
      ((this._AccessInputs.AccessBirthDate && this._AccessInputs.ValidBirth) || !this._AccessInputs.AccessBirthDate || this._signUpRequest.IsAnonymous)) // Apply only if Allow Birth Date
    {

      this._model.loadGSingUp = true;

      this._signUpRequest.IP = this._Location.ip;
      this._signUpRequest.IdSite = Number(this._configData.IdSite);
      this._signUpRequest.Language = this._Translate.store.currentLang;
      this._signUpRequest.Cookies = this.SetCookies(); // Set cookies of Sign Up
      this._signUpRequest.SiteDomain = this._domain;
      if (this._signUpRequest.IsAnonymous == true) {
        this._signUpRequest.PromotionalCode == "";
        this._signUpRequest.Cookies = new CookiesDto();
      }

      /**
       * Include fraud prevention details
       */
      //this._signUpRequest.FraudDetails = this._miscService.GetFraundPreventionDetails(JzFraudPreventionsActionsEnum.Signup, Number(this._configData.IdSite));
      //console.log('SINGUP REQUEST', this._signUpRequest);
      await this.QuickPlayerInsert().then((c: QuickSignUpResult) => {
        if (c) {
          if (c.Id > 0 && this._WithOutAutentification == false) // Success
          {
            this._signUpRequest.IdPlayer = c.Id;
            this._signUpRequest.Player = c.Player;
            if (this._Comunication) {
              let f: Comunication = new Comunication();
              f.email = true;
              f.phone = true;
              f.sms = true;
              f.post = true;
              f.idPlayer = this._signUpRequest.IdPlayer;
              f.lastModifiedBy = 1; // by Internet
              this.signupService.SendComunicationInfo(this._configData.jazzCoreApi, f).subscribe(data => { });
            }
            this._Step = 1; // Go verified code
            window.scroll({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
            console.log("entro al primer if");
          } else if (c.Id > 0 && this._WithOutAutentification == true) {
            this._signUpRequest.IdPlayer = c.Id;
            this._signUpRequest.Player = c.Player;
            if (this._Comunication) {
              let f: Comunication = new Comunication();
              f.email = true;
              f.phone = true;
              f.sms = true;
              f.post = true;
              f.idPlayer = this._signUpRequest.IdPlayer;
              f.lastModifiedBy = 1; // by Internet
              this.signupService.SendComunicationInfo(this._configData.jazzCoreApi, f).subscribe(data => { });
            }
            console.log("entro al segundo if");
            console.log('RESPOSE',c);
            console.log('REQUEST',this._signUpRequest);
          if(this._appCode && this._appCode.length>0)
            this._Step = 4;
          else
            this._Step = 5;
            //this.ActionLoginForSite();

          } else {
            switch (c.Id) {
              case -6: // Error sp Insert player
                this._message = 'Generics.ErrorProcess';
                break;

              case -5: // ErrorUpdate prefix
                this._message = 'Generics.ErrorProcess';
                break;

              case -4: //Not exist Master player
                this._message = 'Generics.ErrorProcess';
                break;

              case -3: // Config default master player is Empty
                this._message = 'Generics.ErrorProcess';
                break;

              case -2: // Player already exist in group
                this._message = this._Translate.instant('Generics.Error') + ':  ' + c.MsjError;
                break;

              default: // Generic error
                this._message = 'Generics.ErrorProcess';
                break;
            }
          }
        }
        this._model.loadGSingUp = false;
      }, error => {
        this._model.loadGSingUp = false;
        this._message = 'Generics.ErrorProcess';
      }).catch(resp => {
        this._message = 'Generics.ErrorProcess';
      });
    }

  }

  async QuickPlayerInsert() {
    return new Promise((resolve, reject) => {
      this.validateDate();
      try {
        if (this._ValidateDate) {
          this.signupService.QuickPlayerInsert(this._configData.jazzCoreApi,this._signUpRequest)
            .subscribe((resp) => {
              resolve(resp);
            });
        }
      } catch (error) {
        let quickResponse = new QuickSignUpResult();
        quickResponse.Id = -999;
        quickResponse.MsjError = error;
        reject(quickResponse);
      }
    });
  }

  validateDate(): boolean {
    try {
      let m: string = "" + this._signUpRequest.MonthBirth;
      if (Number(m) < 10) {
        m = "0" + m;
      }
      let d: string = "" + this._signUpRequest.DayBirth;
      if (Number(d) < 10) {
        d = "0" + d;
      }
      let x: string = this._signUpRequest.YearBirth + m + d;
      let currentMonth: number = this._date.getMonth() + 1;
      let currentDay: number = this._date.getDate();
      let currentYear: number = this._date.getFullYear();
      let y: number = currentYear * 10000 + currentMonth * 100 + currentDay * 1;
      if ((y - parseInt(x)) >= 180000) {
        this._ValidateDate = true;
        return true;
      } else {
        this._ValidateDate = false;
        return false;
      }
    } catch {
      console.log("Error validate date");
      return null;
    }
  }

  SetData() {
    // Set Days
    this._DaysDetails = [];
    for (let index = 1; index <= 31; index++) {
      this._DaysDetails.push({
        Id: index,
        Name: index >= 10 ? index.toString() : "0" + index,
        Value: index >= 10 ? index.toString() : "0" + index,
      });
    }

    // Set Month
    this._MonthDetails = [];
    for (let index = 1; index <= 12; index++) {
      this._MonthDetails.push({
        Id: index,
        Name: `signupColumns.Date.Date${index}`,
        Value: index >= 10 ? index.toString() : "0" + index,
      });
    }

    // Set Year
    this._YearDetails = [];
    for (let index = 1930; index <= 2022; index++) {
      this._YearDetails.push({
        Id: index,
        Name: index.toString(),
        Value: index.toString(),
      });
    }

    this._signUpRequest.DayBirth =
      this._signUpRequest.MonthBirth =
      this._signUpRequest.YearBirth =
      0;

    //Set Email And Promocode If Exists
    try {
      if (localStorage.getItem("landingPromoCode")) {
        var landingPagePromocode = JSON.parse(
          localStorage.getItem("landingPromoCode")
        );
        if (landingPagePromocode) {
          if (
            landingPagePromocode.email &&
            landingPagePromocode.email.trim().length > 0
          ) {
            this._signUpRequest.Email = landingPagePromocode.email;
            this._signUpRequest.EmailConfirmation = landingPagePromocode.email;
          }

          if (
            landingPagePromocode.promoCode &&
            landingPagePromocode.promoCode.trim().length > 0
          )
            this._signUpRequest.PromotionalCode =
              landingPagePromocode.promoCode;

          localStorage.removeItem("landingPromoCode");
        }
      }
    } catch (error) {
      console.log("SET EMAIL PROMOCODE ", { error });
    }

    try {
      if (localStorage.getItem("signUp")) {
        var signUp = JSON.parse(localStorage.getItem("signUp"));
        if (signUp) {
          if (signUp.FirstName && signUp.FirstName.trim().length > 0) {
            this._signUpRequest.FirstName = signUp.FirstName;
          }
          if (signUp.LastName && signUp.LastName.trim().length > 0) {
            this._signUpRequest.LastName = signUp.LastName;
          }
          if (signUp.Email && signUp.Email.trim().length > 0) {
            this._signUpRequest.Email = signUp.Email;
            this._signUpRequest.EmailConfirmation = signUp.Email;
          }
          if (signUp.Password && signUp.Password.trim().length > 0) {
            this._signUpRequest.Password = signUp.Password;
          }

          if (
            signUp.PasswordConfirmation &&
            signUp.PasswordConfirmation.trim().length > 0
          ) {
            this._signUpRequest.PasswordConfirmation =
              signUp.PasswordConfirmation;
          }

          if (signUp.PhoneNumber && signUp.PhoneNumber.trim().length > 0) {
            this._signUpRequest.PhoneNumber = signUp.PhoneNumber;
          }
        }
        localStorage.removeItem("signUp");
      }
    } catch (error) {
      console.log("SET PLAYER SIGNUP ", { error });
    }
  }

  validateCPF(IsValid: boolean){


  }


}
