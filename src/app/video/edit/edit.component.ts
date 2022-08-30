import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter()
  showAlert: boolean = false;
  alertMsg: string = 'Please wait! Updating Clip.';
  alertColor: string = 'blue';
  inSubmission: boolean = false;

  clipID = new FormControl('', {
    nonNullable: true,
  });
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  constructor(private modal: ModalService, private clipService: ClipService) {}

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregisterModal('editClip');
  }

  ngOnChanges(): void {
    if (!this.activeClip || !this.activeClip.docID) {
      return;
    }

    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }

  async submit() {

    if(!this.activeClip){
      return
    }
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your clip is being uploaded.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong! Please try again later';
      return;
    }

    this.update.emit(this.activeClip)

    this.activeClip.title = this.title.value

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
  }
}
