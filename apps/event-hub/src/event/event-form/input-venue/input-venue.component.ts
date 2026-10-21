import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { NominatimApiService, NominatimSuggestion } from '@myorg/modules';
import { FormControlWrapper } from '@myorg/shared-ui';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiComboBox, TuiDataListWrapper } from '@taiga-ui/kit';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';

const MIN_QUERY_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 400;

@Component({
  selector: 'app-input-venue',
  imports: [TuiTextfield, TuiDataListWrapper, ReactiveFormsModule, TuiComboBox],
  templateUrl: './input-venue.component.html',
  styleUrl: './input-venue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputVenueComponent extends FormControlWrapper {
  readonly #nominatimService = inject(NominatimApiService);

  readonly #query = signal<string>('');

  protected readonly suggestions = toSignal(
    toObservable(this.#query).pipe(
      debounceTime(SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(),
      filter((query) => query.length >= MIN_QUERY_LENGTH),
      switchMap((query) => this.#nominatimService.search(query)),
    ),
    { initialValue: [] },
  );

  protected stringifyVenue(item: NominatimSuggestion | null): string {
    return item?.display_name ?? '';
  }

  protected onSearch(event: Event): void {
    if (!(event.target instanceof HTMLInputElement)) return;
    this.#query.set(event.target.value);
  }
}
