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
  ElementRef,
  InjectionToken,
  Injector,
  ReflectiveInjector
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Observable, Subject } from 'rxjs';

import { DialogBoxComponent } from './dialog-box/dialog-box.component';

/**
 * The inject token used to inject the data (if provided) into the dialog component.
 * See [[DialogOptions.data]].
 */
export const CRU_DIALOG_DATA = new InjectionToken<any>('cru-dialog-data');

/**
 * The reason why dialog is closed.
 * - `'close'` means it is closed after it was opened (aka. visible).
 * - `'cancel'` means it is canceled before being opened, which means
 * it is killed during waiting in queue.
 */
export type DialogCloseReason = 'close' | 'cancel';

/**
 * The state of the dialog.
 * - `'closed'` means it is closed after it was opened (see [[DialogCloseReason]]).
 * - `'canceled'` means it is canceled before being opened (see [[DialogCloseReason]]).
 * - `'waiting'` means it is waiting in the queue.
 * - `'opening'` means it is open now and visible.
 */
export type DialogState = 'closed' | 'canceled' | 'waiting' | 'opening';

/**
 * The interface of the returned object of [[CruDialogService.pushDialog]].
 * It represents a diaglog ref. You can check some properties and/or perform
 * some actions via this on the dialog after creating it.
 */
export interface DialogRef<T> {
  /**
   * The component instance of the dialog.
   */
  readonly component: T | null;
  /**
   * The component template class of the dialog.
   */
  readonly componentTemplate: Type<T>;
  /**
   * The state of the dialog. See [[DialogState]] for each possible value and its meaning.
   */
  readonly state: DialogState;
  /**
   * An [[Observable]] emits and completes when the dialog is closed or canceled.
   *
   * The emitted value indicates the close reason. See [[DialogCloseReason]] for
   * each possible value and its meaning.
   */
  readonly close$: Observable<DialogCloseReason>;
  /**
   * Close or cancel the dialog. Return the real reason whether it is closed or canceled.
   * See [[DialogCloseReason]].
   *
   * Calls after the dialog is closed (whether closed by this function or other way) or canceled
   * have no effects and always return the same value that is the true reason.
   */
  close(): DialogCloseReason;
}

/**
 * Passed as a optional second argument in [[CruDialogService.pushDialog]].
 * It provides some options when used to creating dialog.
 */
export interface DialogOptions {
  /**
   * The color of overlay (the cover covering the whole page).
   * Default value can be set on overlay component.
   */
  overlayBackground?: string;
  /**
   * Whether to close the dialog when user clicks on the overlay.
   * Default value can be set on overlay component.
   */
  overlayCloseOnClick?: boolean;
  /**
   * The data passed to the dialog component.
   * If presented, it will be able to be injected to the component with [[CRU_DIALOG_DATA]].
   */
  data?: any;
}

/**
 * The internal interface of [[DialogRef]], which contains some other properties used internal.
 */
interface DialogRefInternal<T> extends DialogRef<T> {
  /**
   * Saves the object passed as the second argument of [[CruDialogService.pushDialog]].
   */
  _options?: DialogOptions;
  /**
   * Open the dialog and make it visible.
   * This function creates the component from the template and adds it to overlay.
   * It will check the current state and only make effects when [[state]] is `'waiting'`.
   */
  _open(): void;
}

/**
 * The core service of cru-dialog module. It provides function to create dialog.
 */
@Injectable({
  providedIn: 'root'
})
export class CruDialogService {
  /**
   * The overlay component instance. Null if not created now.
   */
  public _dialogOverlay: DialogOverlayComponent | null = null;

  /**
   * Internal dialog queue. It is the identical array as [[dialogQueue]]. But its element
   * is of type [[DialogRefInternal]].
   */
  private readonly _dialogQueue: DialogRefInternal<any>[] = [];

  /**
   * Current dialog queue.
   */
  public readonly dialogQueue: DialogRef<any>[] = this._dialogQueue;

  /**
   * Push a dialog to the queue. If the queue is empty before, the dialog is opened
   * right now. If the queue is not empty, then the dialog is opened after all the
   * dialogs in front of it are closed or canceled unless itself is canceled.
   * @param contentTemplate The component type used to create the dialog.
   * @param options Options to customize the component and/or forward data.
   * @returns A [[DialogRef]] instance to control the dialog.
   */
  public pushDialog<T>(contentTemplate: Type<T>, options?: DialogOptions): DialogRef<T> {
    if (!this._dialogOverlay) {
      throw new Error(
        'Please create a overlay! Add a cru-dialog-overlay element to the root component.'
      );
    }

    const overlay = this._dialogOverlay;

    if (this._dialogQueue.length >= 10) {
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
        if (state !== 'waiting') {
          return;
        }
        state = 'opening';
        overlay.background = (options && options.overlayBackground) || overlay.defaultBackground;
        overlay.closeOnClick =
          (options && options.overlayCloseOnClick) || overlay.defaultCloseOnClick;
        overlay.createContent(contentTemplate, () => {
          closeSubject.next('close');
          closeSubject.complete();
          component = null;
        }, options && options.data);
        component = overlay.contentComponent;
      },
      _options: options
    };
    closeSubject.subscribe(reason => {
      const index = this.dialogQueue.indexOf(dialog);
      if (index > -1) {
        // remove it from dialog queue
        this.dialogQueue.splice(index, 1);
      }
      // if the current dialog is **closed**, then there might be dialog waiting in the queue
      // then open it next tick
      if (reason === 'close') {
        if (this._dialogQueue.length !== 0) {
          setTimeout(() => {
            if (this._dialogQueue.length !== 0) {
              this._dialogQueue[0]._open();
            }
          }, 0);
        }
      }
    });

    const openNow = this.dialogQueue.length === 0;
    this._dialogQueue.push(dialog);
    // if queue is empty, open the dialog now
    if (openNow) {
      dialog._open();
    }
    return dialog;
  }
}

/**
 * The directive used to get the dialog content container and provides
 * destroy notifying.
 */
@Directive({
  selector: '[cru-dialog-outlet]'
})
export class DialogOutletDirective implements OnDestroy {
  public constructor(public viewContainerRef: ViewContainerRef) { }

  /**
   * The handler invoked when the directive is destroyed.
   */
  public closeHandler!: () => void;

  public ngOnDestroy(): void {
    this.closeHandler();
  }
}

/**
 * The overlay of the dialog. It controls the lifetime of dialog and provides a container of dialog.
 * It also provides a background.
 */
@Component({
  selector: 'cru-dialog-overlay',
  template:
    `
      <div *ngIf="hostVisible" #trueOverlay [style.background]="background" (click)="onClick($event)">
        <ng-container cru-dialog-outlet></ng-container>
      </div>
    `,
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
    private changeDetector: ChangeDetectorRef,
    private injector: Injector
  ) { }
  /**
   * The default background of the overlay. Used when the background is not
   * provided in dialog options.
   */
  @Input()
  public defaultBackground: string = '#00000080';

  public background!: string;

  /**
   * The default value of whether to close the dialog when overlay is clicked.
   * Used when the value is not provided in dialog options.
   */
  @Input()
  public defaultCloseOnClick: boolean = true;

  public closeOnClick!: boolean;

  @ViewChild('trueOverlay', { static: false })
  public trueOverlay: ElementRef | null = null;

  @ViewChild(DialogOutletDirective, { static: false })
  public host: DialogOutletDirective | null = null;

  public hostVisible: boolean = false;

  public contentComponent: any = null;

  public ngOnInit(): void {
    if (this.service._dialogOverlay) {
      throw new Error('An dialog overlay is already created.');
    }
    this.service._dialogOverlay = this;
  }

  public ngOnDestroy(): void {
    this.service._dialogOverlay = null;
  }

  /**
   * Create a component instance of given component template class.
   * Add it to the tree.
   * @param contentTemplate the component class to create
   * @param closeHandler the handler called when it is destroyed
   * @param data the data passed to the dialog component
   */
  public createContent(contentTemplate: Type<any>, closeHandler: () => void, data?: any): void {
    if (this.hostVisible) {
      throw new Error('Dialog overlay already has content.');
    }

    this.hostVisible = true;
    this.changeDetector.detectChanges();
    this.host!.closeHandler = closeHandler;
    const contentFactory = this.componentFactoryResolver.resolveComponentFactory(contentTemplate);
    const i = ReflectiveInjector.resolveAndCreate([{ provide: CRU_DIALOG_DATA, useValue: data }], this.injector);
    const componentRef = this.host!.viewContainerRef.createComponent(contentFactory, undefined, i);
    this.contentComponent = componentRef.instance;
  }

  /**
   * Remove the dialog from the tree.
   */
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
  declarations: [DialogOverlayComponent, DialogOutletDirective, DialogBoxComponent],
  exports: [DialogOverlayComponent, DialogBoxComponent]
})
export class CruDialogModule { }
