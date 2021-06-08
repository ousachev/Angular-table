import {Component, OnInit, Input, Renderer2, OnDestroy, Output, EventEmitter} from '@angular/core';
import {ExtendedPost} from "../../../services/get.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() activePost!: ExtendedPost;
  @Output() modalHandler = new EventEmitter();

  constructor(private _renderer: Renderer2,) {
  }

  ngOnInit(): void {
    this._renderer.setStyle(document.body, 'overflow', 'hidden')
  }

  ngOnDestroy(): void {
    this._renderer.setStyle(document.body, 'overflow', 'auto')
  }

  handleClose() {
    this.modalHandler.emit();
  }
}
