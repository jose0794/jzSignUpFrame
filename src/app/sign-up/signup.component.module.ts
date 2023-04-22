import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './signup.component';
import { signUpRoutingModule } from './signup-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
    declarations: [SignUpComponent],
    imports: [
      CommonModule
      , signUpRoutingModule
      , FormsModule
      , TranslateModule
      , ReactiveFormsModule
      , DropdownModule
      , BrowserAnimationsModule
      , CheckboxModule
      , InputSwitchModule
    ]
  })
  export class SignUpComponentModule { }