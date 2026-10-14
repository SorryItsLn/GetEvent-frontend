import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { NominatimSuggestion } from './types/nominatim.type';

@Injectable({ providedIn: 'root' })
export class NominatimApiService {
  readonly #http = inject(HttpClient);
  readonly #baseUrl = 'https://nominatim.openstreetmap.org';

  search(query: string): Observable<NominatimSuggestion[]> {
    console.log('as');

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
