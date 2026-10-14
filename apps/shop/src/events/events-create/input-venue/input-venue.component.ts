import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NominatimApiService, NominatimSuggestion } from '@myorg/modules';
import { FormControlWrapper } from '@myorg/shared-ui';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiComboBox, TuiDataListWrapper } from '@taiga-ui/kit';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-input-venue',
  imports: [TuiTextfield, TuiDataListWrapper, ReactiveFormsModule, FormsModule, TuiComboBox],
  templateUrl: './input-venue.component.html',
  styleUrl: './input-venue.component.scss',
})
export class InputVenueComponent extends FormControlWrapper {
  readonly #nominatim = inject(NominatimApiService);

  readonly query = signal<string>('');

  suggestions = toSignal(
    toObservable(this.query).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      filter((q) => q.length >= 3),
      switchMap((q) => this.#nominatim.search(q)),
    ),
    { initialValue: [] },
  );

  stringifyVenue(item: NominatimSuggestion) {
    return `${item?.display_name}`;
  }

  protected onSearch(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    this.query.set(event.target.value);
  }
}
