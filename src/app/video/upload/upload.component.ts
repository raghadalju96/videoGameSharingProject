import { Component, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragover = false;
  file: File | null = null;
  nextStep = false;
  showAlert: boolean = false;
  alertMsg: string = 'Please wait! Your clip is being uploaded.';
  alertColor: string = 'blue';
  inSubmission: boolean = false;
  persentage = 0;
  showPersentage = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService
  ) {
    auth.user.subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    this.task?.cancel()
  }

  storeFile(event: Event) {

    this.isDragover = true;
    this.file = (event as DragEvent).dataTransfer ? 
    (event as DragEvent).dataTransfer?.files.item(0) ?? null :
    (event.target as HTMLInputElement).files?.item(0) ?? null

    console.log(this.file);

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  uploadFile() {
    this.uploadForm.disable()
    this.showAlert = true;
    this.alertMsg = 'Your clip is uploaded successfully';
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.showPersentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    this.task.percentageChanges().subscribe((progress) => {
      this.persentage = (progress as number) / 100;
    });

    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            fileName: `${clipFileName}.mp4`,
            title: this.title.value,
            url,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
          };
          this.alertColor = 'green';
          this.alertMsg = 'Success! Your clip is now ready to share with  ';
          this.showPersentage = false;
          this.clipService.createClip(clip);
          console.log(clip);
        },
        error: (error) => {
          this.uploadForm.enable()
          this.alertColor = 'red';
          this.alertMsg = 'Upload failed! Please try again later';
          this.showPersentage = false;
          this.inSubmission = true;
          console.error(error);
        },
      });
  }
}
