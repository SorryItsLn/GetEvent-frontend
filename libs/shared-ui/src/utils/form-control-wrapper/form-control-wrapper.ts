import type { OnDestroy, OnInit } from '@angular/core';
import { ChangeDetectorRef, DestroyRef, Directive, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { ControlValueAccessor } from '@angular/forms';
import {
  FormControl,
  FormControlDirective,
  FormControlName,
  NgControl,
  NgModel,
} from '@angular/forms';
import { EMPTY_FUNCTION } from '@taiga-ui/cdk';

@Directive()
export class FormControlWrapper implements OnInit, OnDestroy, ControlValueAccessor {
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  protected readonly changeDetectorRef = inject(ChangeDetectorRef);
  protected readonly destroyRef = inject(DestroyRef);

  readonly disable = input<boolean>(false);

  protected onChange: (value: unknown) => void = EMPTY_FUNCTION;
  protected onTouched: () => void = EMPTY_FUNCTION;
  #control!: FormControl;

  readonly #disabledEffect = effect(() => {
    if (this.disable()) {
      this.control?.disable();
    } else {
      this.control?.enable();
    }
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get control(): FormControl {
    return this.#control;
  }

  ngOnInit(): void {
    if (
      this.ngControl instanceof FormControlDirective ||
      this.ngControl instanceof FormControlName
    ) {
      this.#control = this.ngControl.control;
    } else if (this.ngControl instanceof NgModel) {
      this.#control = this.ngControl.control;
      this.#control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
        if (this.ngControl?.control) {
          this.ngControl?.viewToModelUpdate(value);
        }
      });
    } else {
      this.#control = new FormControl();
    }
  }

  ngOnDestroy(): void {
    this.#disabledEffect.destroy();
  }

  writeValue(): void {
    this.changeDetectorRef.markForCheck();
    if (this.control) {
      this.control.markAsTouched();
      this.control.markAsDirty();
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
