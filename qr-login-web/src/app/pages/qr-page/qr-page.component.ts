import {Component, Inject, OnInit} from '@angular/core';
import {of, Subscription} from "rxjs";
import {WebSocketSubject} from "rxjs/internal-compatibility";
import {webSocket} from "rxjs/webSocket";
import {IDeviceInfo, ISocketMsg} from "../../interface/interface";
import {delay} from "rxjs/operators";
import {Router} from "@angular/router";
import {TokenService} from "../../services/token.service";
import {WS_BASE_URL} from "../../services/api-base-url.injection";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-qr-page',
  templateUrl: './qr-page.component.html',
  styleUrls: ['./qr-page.component.scss']
})
export class QrPageComponent implements OnInit {
  qrData = '';
  expiredQR = false
  device: IDeviceInfo
  private subscribeSocket: Subscription | undefined;
  private subscribeExpireQR: Subscription | undefined;
  private socket: WebSocketSubject<any> | undefined;

  constructor(@Inject(WS_BASE_URL) private wsUrl: string,
              private router: Router,
              private snackBar: MatSnackBar,
              private tokenService: TokenService) {
    this.device = {platform: window.navigator.platform, app: get_browser()}
  }


  ngOnInit() {
    this.socket = webSocket(this.wsUrl)
    this.onSubscribeSocket()

  }

  ngOnDestroy() {
    this.subscribeSocket?.unsubscribe()
    this.subscribeExpireQR?.unsubscribe()
  }

  onSubscribeSocket() {
    this.subscribeSocket = this.socket?.subscribe((res: ISocketMsg) => {
      if (res.name == 'qr') {
        this.expiredQR = false
        this.qrData = 'data:image/png;base64,' + res.data
        this.createQR(res)
        return
      } else if (res.name == 'token') {
        this.tokenService.setToken(atob(res.data))
        this.router.navigateByUrl("")
      }
    }, err => {
      this.subscribeSocket?.unsubscribe()
      this.expiredQR = true
      this.snackBar.open(err.message)
    })
    this.socket?.next(this.device)
  }

  private createQR(res: ISocketMsg) {
    this.subscribeExpireQR?.unsubscribe()
    this.subscribeExpireQR = of("").pipe(delay(10000)).subscribe(() => {
      this.subscribeSocket?.unsubscribe()
      this.expiredQR = true
    })
  }
}

function get_browser(): string {
  let ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return 'IE' + (tem[1] || '');
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR|Edge\/(\d+)/)
    if (tem != null) {
      return 'Opera' + tem[1];
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  return M[0] + " " + M[1];
}
