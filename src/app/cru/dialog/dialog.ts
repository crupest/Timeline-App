import {
  NgModule,
  Component,
  Directive,
  Input,
  Injectable,
  OnInit,
  OnDestroy,
  Type,
  ComponentFactoryResolver,
  ViewContainerRef,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable, Subject } from 'rxjs';

export type DialogCloseReason = 'close' | 'cancel';
export type DialogState = 'closed' | 'canceled' | 'waiting' | 'opening';

export interface DialogRef<T> {
  readonly component: T | null;
  readonly componentTemplate: Type<T>;
  readonly state: DialogState;
  readonly close$: Observable<DialogCloseReason>;
  close(): DialogCloseReason;
}

export interface DialogOptions {
  overlayBackground?: string;
  overlayCloseOnClick?: boolean;
  data: any;
}

interface DialogRefInternal<T> extends DialogRef<T> {
  _options?: DialogOptions;
  _open(): void;
}

@Injectable({
  providedIn: 'root'
})
export class CruDialogService {
  public _dialogOverlay: DialogOverlayComponent | null = null;

  private readonly _dialogQueue: DialogRefInternal<any>[] = [];
  public readonly dialogQueue: DialogRef<any>[] = this._dialogQueue;

  public pushDialog<T>(contentTemplate: Type<T>, options?: DialogOptions): DialogRef<T> {
    if (!this._dialogOverlay) {
      throw new Error('Please create a overlay!'); //TODO: explain the error more detailedly.
    }
    const overlay = this._dialogOverlay;

    if (this._dialogQueue.length > 10) {
      console.warn('Too many (> 10) dialogs are waiting in queue.');
    }

    const closeSubject = new Subject<DialogCloseReason>();
    let state: DialogState = 'waiting';
    let component: T | null = null;

    const dialog: DialogRefInternal<T> = {
      get component(): T | null {
        return component;
      },
      componentTemplate: contentTemplate,
      get state(): DialogState {
        return state;
      },
      close$: closeSubject,
      close(): DialogCloseReason {
        if (state === 'opening') {
          overlay.destroyContent();
          return 'close';
        } else if (state === 'waiting') {
          closeSubject.next('cancel');
          closeSubject.complete();
          return 'cancel';
        } else if (state === 'canceled') {
          return 'cancel';
        } else {
          return 'close';
        }
      },
      _open() {
        state = 'opening';
        overlay.background = (options && options.overlayBackground) || overlay.defaultBackground;
        overlay.closeOnClick =
          (options && options.overlayCloseOnClick) || overlay.defaultCloseOnClick;
        overlay.createContent(contentTemplate, () => {
          closeSubject.next('close');
          closeSubject.complete();
          component = null;
        });
        component = overlay.contentComponent;
        (<any>component).data = options && options.data;
      },
      _options: options
    };
    closeSubject.subscribe(reason => {
      const index = this.dialogQueue.indexOf(dialog);
      if (index > -1) {
        this.dialogQueue.splice(index, 1);
      }
      if (reason === 'close') {
        setTimeout(() => {
          if (this._dialogQueue.length !== 0) {
            this._dialogQueue[0]._open();
          }
        }, 0);
      }
    });

    const openNow = this.dialogQueue.length === 0;
    this._dialogQueue.push(dialog);
    if (openNow) {
      dialog._open();
    }
    return dialog;
  }
}

@Directive({
  selector: '[cru-dialog-host]'
})
export class DialogHostDirective implements OnDestroy {
  public constructor(public viewContainerRef: ViewContainerRef) {}

  public closeHandler!: () => void;

  public ngOnDestroy(): void {
    this.closeHandler();
  }
}

@Component({
  selector: 'cru-dialog-overlay',
  template:
    '<div *ngIf="hostVisible" #trueOverlay [style.background]="background" (click)="onClick($event)"><ng-container cru-dialog-host></ng-container></div>',
  styles: [
    `
      div {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `
  ]
})
export class DialogOverlayComponent implements OnInit, OnDestroy {
  public constructor(
    private service: CruDialogService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetector: ChangeDetectorRef
  ) {}

  @ViewChild('trueOverlay', { static: false })
  public trueOverlay: ElementRef | null = null;

  @Input()
  public defaultBackground: string = '#00000080';

  public background!: string;

  @Input()
  public defaultCloseOnClick: boolean = true;

  public closeOnClick!: boolean;

  @ViewChild(DialogHostDirective, { static: false })
  public host: DialogHostDirective | null = null;

  public hostVisible: boolean = false;

  public contentComponent: any = null;

  public ngOnInit(): void {
    this.service._dialogOverlay = this;
  }

  public ngOnDestroy(): void {
    this.service._dialogOverlay = null;
  }

  public createContent(contentTemplate: Type<any>, closeHandler: () => void): void {
    if (this.hostVisible) {
      throw new Error('Dialog overlay already has content.');
    }

    this.hostVisible = true;
    this.changeDetector.detectChanges();
    this.host!.closeHandler = closeHandler;
    const contentFactory = this.componentFactoryResolver.resolveComponentFactory(contentTemplate);
    const componentRef = this.host!.viewContainerRef.createComponent(contentFactory);
    this.contentComponent = componentRef.instance;
  }

  public destroyContent(): void {
    if (!this.hostVisible || !this.host) {
      throw new Error('Dialog overlay has no content.');
    }
    this.host!.viewContainerRef.clear();
    this.hostVisible = false;
    this.changeDetector.detectChanges();
  }

  public onClick(event: MouseEvent): void {
    if (this.closeOnClick && event.target === this.trueOverlay!.nativeElement) {
      this.destroyContent();
    }
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [DialogOverlayComponent, DialogHostDirective],
  exports: [DialogOverlayComponent]
})
export class CruDialogModule {}
