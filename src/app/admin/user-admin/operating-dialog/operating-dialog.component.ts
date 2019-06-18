import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { CRU_DIALOG_CONTROLLER, DialogController } from 'src/app/cru/dialog/dialog';

export type OperatingStep = 'input' | 'process' | 'done' | 'error';

export type OperatingResult = 'success' | 'cancel' | 'error';

const stepToResultMap: {[Key in OperatingStep]: OperatingResult} = {
  'input': 'cancel',
  'process': 'cancel',
  'done': 'success',
  'error': 'error'
};

@Component({
  selector: 'app-operating-dialog',
  templateUrl: './operating-dialog.component.html',
  styleUrls: ['./operating-dialog.component.css']
})
export class OperatingDialogComponent implements AfterViewChecked {
  public constructor(@Inject(CRU_DIALOG_CONTROLLER) private controller: DialogController) {}

  @ViewChild('doItButton', { static: false })
  public doItButton: ElementRef | undefined;
  @ViewChild('closeButton', { static: false })
  public closeButton: ElementRef | undefined;

  private _step: OperatingStep = 'input';

  @Input()
  public set step(value: OperatingStep) {
    this._step = value;
    this.controller.closeData = stepToResultMap[value];
  }

  public get step(): OperatingStep {
    return this._step;
  }

  @Output()
  public readonly submit = new EventEmitter();

  public ngAfterViewChecked(): void {
    this.doItButton && this.doItButton.nativeElement.focus();
    this.closeButton && this.closeButton.nativeElement.focus();
  }

  public close(): void {
    this.controller.close();
  }

  public doIt(): void {
    this.submit.emit();
  }
}
