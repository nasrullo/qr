import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QrPageComponent} from "./pages/qr-page/qr-page.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";
import {AuthGuard} from "./services/auth-guard.service";

const routes: Routes = [
  {
    path: "qr",
    component: QrPageComponent,
  },
  {
    path: "",
    component: HomePageComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
