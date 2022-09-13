import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css']
})
export class ClipsListComponent implements OnInit, OnDestroy {

  constructor(public clipService:ClipService) {
    clipService.getClips()
   }

  ngOnInit(): void {

    window.addEventListener('scroll', this.handelScroll)
  }

  ngOnDestroy(): void {
     window.removeEventListener('scroll', this.handelScroll)
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
