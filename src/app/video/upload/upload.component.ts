import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  isDragover = false;
  file: File | null = null;
  nextStep = false;
  showAlert: boolean = false;
  alertMsg: string = 'Please wait! Your clip is being uploaded.';
  alertColor: string = 'blue';
  inSubmission: boolean = false;
  persentage = 0
  showPersentage = false
  user : firebase.User | null = null

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
  });

  constructor(private storage: AngularFireStorage, private auth: AngularFireAuth) {
    auth.user.subscribe(user => this.user = user)
  }

  ngOnInit(): void {}

  storeFile(event: Event) {
    this.isDragover = true;

    this.file = (event as DragEvent).dataTransfer?.files.item(0) ?? null;
    console.log(this.file);
    console.log(event);

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  uploadFile() {

    this.showAlert = true;
    this.alertMsg = 'Your clip is uploaded successfully';
    this.alertColor = 'blue';
    this.inSubmission = true; 
    this.showPersentage = true

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    const task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath)
    task.percentageChanges().subscribe(progress => {
      this.persentage = progress as number / 100
    })

    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe(
      {
        next: (url)=> {
          const clip = {
            uid: this.user?.uid,
            displayName:this.user?.displayName,
            fileName:`${clipFileName}.mp4`,
            title:this.title.value,
            url

          }
          this.alertColor = 'green'
          this.alertMsg = 'Success! Your clip is now ready to share with  '
          this.showPersentage = false
          console.log(clip);
          

        },
        error:(error) => {

          this.alertColor = 'red'
          this.alertMsg = 'Upload failed! Please try again later'
          this.showPersentage = false
          this.inSubmission = true
          console.error(error);
          

        }
      }
    )
  }
}
