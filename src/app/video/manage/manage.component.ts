import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Params, Router } from '@angular/router';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  videoOrder = '1'
  clips:IClip[]=[]
  activeClip: IClip | null  = null
  sort$:BehaviorSubject<string> 

  constructor(private router:Router, private route:ActivatedRoute, private clipService: ClipService, private modal:ModalService) {
    this.sort$ = new BehaviorSubject(this.videoOrder)

    
   
  }

  ngOnInit(): void {this.route.queryParamMap.subscribe((params:Params) => {
     this.videoOrder = params.sort == '1' ? params.sort : '2'
     this.sort$.next(this.videoOrder)
  })

  this.clipService.getUserClips(this.sort$).subscribe(docs => {
    this.clips = []

    docs.forEach(doc => {
      this.clips.push({
        docID:doc.id,
        ...doc.data()
      })
    })
  })

  }

  sort(event:Event){
    const {value} = (event.target as HTMLSelectElement)
    console.log(value);
  //  this.router.navigateByUrl(`/manage?sort=${value}`)

    this.router.navigate([], {
      relativeTo:this.route,
      queryParams:{
        sort:value
      }
    })
  }

  openModal(event:Event, clip:IClip){
      event.preventDefault()
      this.activeClip = clip
      this.modal.toggleModal('editClip')
  }

  update(event:IClip){
    this.clips.forEach((element, index) => {
      if(element.docID === event.docID){
        this.clips[index].title = event.title
      }
    })
  }

  delete(event:Event, clip:IClip){
   event.preventDefault()

   this.clipService.deleteClip(clip)

   this.clips.forEach((element, index)=> {

    if(element.docID == clip.docID){
      this.clips.splice(index,1)
    }
   })
  }

 async copyToClipboard($event: MouseEvent, docID:string | undefined){
  $event.preventDefault()
  if(!docID){
    return
  }
  const url = `${location.origin}/clip/${docID}`

  await navigator.clipboard.writeText(url)

  alert('Link Copied')
 }

}
