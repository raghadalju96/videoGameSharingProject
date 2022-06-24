import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
})
export class AuthModalComponent implements OnInit, OnDestroy {
  constructor(
    private modalService: ModalService,
    private close: AppComponent
  ) {}

  authClose = false;

  ngOnInit(): void {
    this.modalService.register('auth');
    //  this.modalService.register('test');
  }

  ngOnDestroy(): void {
    this.modalService.unregisterModal('auth');
    console.log('destory');
    // this.close.authClose = true;
    // console.log(this.close.authClose);
  }
}
