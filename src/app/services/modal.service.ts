import { Injectable } from '@angular/core';
import { elementAt } from 'rxjs';

interface Imodal {
  id: string;
  visable: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public modals: Imodal[] = [];
  constructor() {}

  // private raghad ={
  //  id:String,
  // visables:Boolean
  // }

  register(id: string) {
    this.modals.push({
      id,
      visable: true,
    });
    console.log(this.modals);
  }

  unregisterModal(id:string){
    this.modals =this.modals.filter(element => element.id != id);
    console.log(this.modals);
  
  }

  isModalOpen(id: string) {
    const modal = Boolean(
      this.modals.find((element) => element.id === id)?.visable
    );
    return modal;
  }

  toggleModal(id: string) {
    console.log('raghad');

    const modal = this.modals.find((element) => element.id === id);

    if (modal) {
      modal.visable = !modal.visable;
    }
  }
}
