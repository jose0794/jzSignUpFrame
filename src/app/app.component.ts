import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
title = 'jzSignUpFrame';

constructor(protected _translate: TranslateService) { }

ngOnInit(): void {
  this.setTranslate();
}

private async setTranslate() {

  try {
    const _lan: string[] = ['en', 'es'];
    this._translate.addLangs(_lan);
    this._translate.setDefaultLang(_lan[0]);
    //const _browserLang = this._translate.getBrowserLang();
    this._translate.use(_lan[0]);

  } catch { }
}
}
