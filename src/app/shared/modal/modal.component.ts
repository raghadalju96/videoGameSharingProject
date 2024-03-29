import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ModalService } from 'src/app/services/modal.service';
import { AuthModalComponent } from 'src/app/user/auth-modal/auth-modal.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit , OnDestroy{
  constructor(public modalService: ModalService, public auth:AppComponent, 
    public el:ElementRef) {
    console.log(el);
    
  }

  @Input() modalID = ''


  ngOnInit(): void {

    document.body.appendChild(this.el.nativeElement)
  }
  ngOnDestroy() {
    document.body.removeChild(this.el.nativeElement)
  }

  closeModal() {
    return this.modalService.toggleModal(this.modalID);
  }
}
