export class LocationDto {
  city: string;
  country: string;
  ip: string;
  postal: string;
  region: string;
  country_code: string;
  region_code: string;
  error: string;
  latitude?: string;
  longitude?: string;
  hostname?: string;
  org?: string;
}

export class Country {
  idCountry: string;
  country: string;
}

export class State {
  idISOCountry: string;
  idISOState: string;
  state: string;
}

export class QuickSignUpDto {
  NickName: string;
  IP: string;
  IdSite: number;
  SiteDomain: string;
  Language: string;
  Title: string;
  IsAnonymous: boolean;
  VerifyByPhone: boolean;
  Player: string;
  IdPlayer: number;
  FirstName: string;
  LastName: string;
  LastName2: string;
  Email: string;
  EmailConfirmation: string;
  Address: string;
  Address2: string;
  PhoneNumber: string;
  AttachPictureId: string;
  GovernmentId: string;
  Currency: Currency;
  Country: Country;
  CountryCode: string;
  State: State;
  LineType: LineTypeModel;
  City: string;
  Password: string;
  PasswordConfirmation: string;
  Fax: string;
  Zip: string;
  DateBirth: Date;
  DayBirth: number;
  MonthBirth: number;
  YearBirth: number;
  SecQuestion: string;
  SecAnswer: string;
  Rfc: string;
  Curp: string;
  Passport: string;
  PromotionalCode: string;
  Hear: string;
  ReferralAccount: string;
  AfiliateCode: string;
  Sportsbook: boolean;
  Casino: boolean;
  Racebook: boolean;
  Poker: boolean;
  Cookies: CookiesDto;
  IdPlayerType: number;
  IdUserSocialNetwork: string;
  IdAgent: number;
  WithAccountVerification: boolean;
  FraudDetails: JzFraudPreventionsDetailsDto;
  IdDocumentType: number;
  CodeSignUp: string;
  IsAplication: boolean;
  IdLang: string;
  CPFType: string;
}

export class Currency {
  idCurrency: number;
  currency: string;
  description: string;
};

export class Currencies {
  Currencies: Currency[];
};

export class ValidInputsDto {
  ValidBirth: boolean;
  EmailsMatch: boolean;
  PasswordMatch: boolean;
  AccessByGoogle: boolean;
  AccessBirthDate: boolean;
  AccessByFacebook: boolean;
  AccessMarketing: boolean;
  AccessMainInterests: boolean;
  AccessTermsAndConditions: boolean;
  AccessAnonymousAccount: boolean;
}

export class CookiesDto {
  AffiliateCode: string;
  BannerCode: string;
  CampaignCode: string;
  RedirectPageCode: string;
  Mpo: string;
}

export class JzFraudPreventionsDetailsDto {
  Ip: string;
  IdSite: number;
  Rule: string;
  BlackBox: string;
}

export class LineTypeModel {
  Id: number;
  Name: string;
  Description: string;
}

export class CodeCountryModel {
  code: string;
  name: string;
  IsoContry: string;
}

export class IsoCodeCountryModel {
  countries: CodeCountryModel[];
}

export class Document {
  IdDocumentType: number;
  DocumentT: string;
}

export class SignUpMessageRequest {
  idSiteTag: number;
  idLanguage: number;
}

export class SignUpMessage {
  idSiteTag: number;
  idLanguage: number;
  messageSite: string;
}

export class SelectGoogleRecaptchaBySiteRquestDto {
  GoogleRecaptchaVersionId?: number;
  SiteId?: number;
  SiteKey: string;
  SecretKey: string;
  IsActive?: boolean;
  LastModifiedBy?: number;
}

export class PlayerDto {
  BonusPointsStatus: string;
  CultureInfo: string;
  Currency: string;
  CurrencySymbol: string;
  EnableCasino: string;
  EnableHorses: string;
  EnableSports: string;
  EnableParlayCards: string;
  EnforcesPassRules: string;
  IdAgent: number;
  IdBook: number;
  IdCall: number;
  IdLanguage: number;
  IdCurrency: number;
  IdGrouping: number;
  IdProfile: number;
  IdLineType: number;
  IdPlayer: number;
  IdProfileLimits: number;
  LineStyle: string;
  MLBLine: string;
  NHLLine: string;
  OnlineMessage: string[] = new Array();
  Password: string;
  PitcherDefault: number;
  UTC: number;
  OnlineWinWager: number;
  OnlinePassword: string;
  DuplicatedBetsOnline: boolean;
  FreePlayAmount: number;
  Status: string;
  OnlineAccess: boolean;
  IdOffice: number;
  HoldBetsL: boolean;
  Gmt: number;
  ClMaxWager: number;
  ResetPassword: boolean;
  Player: string;
  Agent: string;
  Name: string;
  PlayerAvatar: string;
  OptionInitDefault: string;
  Products: ProductDto[];
  BLRTheme: string;
  Hold: boolean = false;
  HoldDelay: number = 0;
  Token: string;
  Email: string;
  Identification: string;
  SettingOptionsByPlayer: SettingOptionsByPlayer[] = [];
  SiteRights: SiteRightsDto;
}

export class ProductDto {
  public Id: number;
  public Name: string;
  public ImageUrl: string;
  public CategoryId: number;
  public Active: boolean;
  public Hidden: boolean;
}

export class SettingOptionsByPlayer {
  public Option: SettingOptions;
  public Enable: boolean;
}

export class SettingOptions {
  public Id: number;
  public Description: string;
  public TranslateKey: string;
  public OptionValue: number;
}

export class SiteRightsDto {
  public OneLogin: boolean;
}

export class GetSite {
  siteDomain: string;
  player: string;
  password: string;
};

export class RequestSiteByPlayerForCountryCurrency {
  siteTag: string;
  idCountry: string;
  idCurrency: number;
};

export class SiteByPlayerForCountryCurrency {
  id: number;
  idSignUpColumn: number;
  name: string;
  idSignUpPlayer: number;
  mandatoryField: boolean;
  isActive: boolean;
  value: string;
  pathLanguage: string;
};

export class Comunication {
  idPlayer: number;
  email: boolean;
  phone: boolean;
  sms: boolean;
  post: boolean;
  lastModifiedBy: number;
}

export class QuickSignUpResult {
  Id: number;
  MsjError: string;
  Player: string;
}

export class GenericDataDto {
  Id: number;
  Name: string;
  Value: string;
}


