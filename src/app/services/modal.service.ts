import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

 private visable : boolean = true;
  constructor() { }

 
isModalOpen(){
  return this.visable;
}

  toggleModal(){
    return this.visable = !this.visable
  }
}
