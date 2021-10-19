import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {IndicatorService} from "./indicator.service";

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,
              private indicatorService: IndicatorService) {
  }

  // tslint:disable-next-line
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("OMAd")
    if (req.url && this.authService.tokenValue) {
      const head = new HttpHeaders({Authorization: `Bearer ${this.authService.tokenValue}`});
      req = req.clone({headers: head});
      this.indicatorService.showBusyIndicator = true;
    }
    return next.handle(req)
      .pipe(
        tap((response) => {
            if (response instanceof HttpResponse) {
              this.indicatorService.showBusyIndicator = false;
            }
            return response;
          },
          (err) => {
            this.indicatorService.showBusyIndicator = false;
            if (err instanceof HttpErrorResponse && err.status === 401) {
              this.router.navigateByUrl('qr');
            }
          })
      );
  }
}
