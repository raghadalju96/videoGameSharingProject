import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ClipService } from '../services/clip.service';


@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers:[DatePipe]
})
export class ClipsListComponent implements OnInit, OnDestroy {

  @Input() scrollable = true

  constructor(public clipService:ClipService) {
    clipService.getClips()
   }

  ngOnInit(): void {
    if(this.scrollable){

    window.addEventListener('scroll', this.handelScroll)
  }}

  ngOnDestroy(): void {
    if(this.scrollable){
     window.removeEventListener('scroll', this.handelScroll)
  }
  this.clipService.pageClips = []
}

  handelScroll = () => {
    const {scrollTop, offsetHeight} = document.documentElement
    const {innerHeight} = window

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight
    console.log(scrollTop);
    console.log(innerHeight);
    console.log(offsetHeight);
    
    
    

    if(bottomOfWindow){
      console.log("bottom of window ");
      this.clipService.getClips()
      
    }
  }

}
