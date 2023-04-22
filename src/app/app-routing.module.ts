import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

const routes: Routes = [
  {
    path: 'activation',
    loadChildren: () => import('../app/activation/activation-routing.module')
      .then(mod => mod.activationRoutingModule)
  } ,
  {
    path: 'signup',
    loadChildren: () => import('../app/sign-up/signup-routing.module')
      .then(mod => mod.signUpRoutingModule)
  },
  {
    path: '',
    loadChildren: () => import('../app/sign-up/signup-routing.module')
      .then(mod => mod.signUpRoutingModule)
  },
  {
    path: '*',
    loadChildren: () => import('../app/sign-up/signup-routing.module')
      .then(mod => mod.signUpRoutingModule)
  }
  , {
    path: 'welcome',
    loadChildren: () => import('../app/welcome-message/welcome-message-routing.module')
      .then(mod => mod.welcomeMessageRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
            HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
