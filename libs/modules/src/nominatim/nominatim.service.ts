import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { NominatimSuggestion } from './types';

@Service()
export class NominatimApiService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = 'https://nominatim.openstreetmap.org';

  search(query: string): Observable<NominatimSuggestion[]> {
    return this.#http.get<NominatimSuggestion[]>(`${this.#baseUrl}/search`, {
      params: {
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        'accept-language': 'ru',
      },
    });
  }
}
