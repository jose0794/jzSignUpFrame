export class ConfigSite {
  JazzApiUrl: string;
  jazzCoreApi: string;
  DefaultHostName: string;
  IdSite: number;
  DomainName: string;
  ImgServerPath: string;
  Language: string;
  IdLanguage: number;
  apiLocation: apiRequestDto[];
}

export class apiRequestDto {
  apiUrl: string;
  apiToken: string;
}

export class WebConfigDto {
  name: string;
  imagesPath: string;
  menuOptions: string[];
  phone: string;
  netellerCode: string;
  ppFormEmail: string;
  ppFormURL: string;
  idSite: string;
  idAgent: number;
  idBook: string;
  language: string;
  landingImages: Array<any> = [];
  exteriorLineStyle: string;
  todayEventSport: string;
  landingPage: string;
}
