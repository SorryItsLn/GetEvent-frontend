import { I18nPluralPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Params, Router, RouterLink } from '@angular/router';
import { EventApiService, EventCategoryApiService } from '@myorg/modules';
import { TuiButton } from '@taiga-ui/core';
import { TuiPagination, TuiSegmented } from '@taiga-ui/kit';
import { distinctUntilChanged, finalize, map, switchMap, take, tap } from 'rxjs';

import {
  EVENT_COUNT_PLURAL,
  EVENT_LIST_DEFAULT_PAGE_SIZE,
  EVENT_LIST_PAGE_QUERY_PARAM,
  EVENT_LIST_PAGE_SIZES,
  EVENT_LIST_SIZE_QUERY_PARAM,
  EVENT_ROUTING_LINKS,
} from '../consts';
import { EventCardComponent } from '../event-card';

type ListQuery = { page: number; pageSize: number };

@Component({
  selector: 'app-event-list',
  imports: [
    TuiButton,
    TuiPagination,
    TuiSegmented,
    RouterLink,
    I18nPluralPipe,
    NgTemplateOutlet,
    EventCardComponent,
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent {
  readonly #eventService = inject(EventApiService);
  readonly #eventCategoryService = inject(EventCategoryApiService);
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);

  readonly #query$ = this.#route.queryParamMap.pipe(
    map(parseListQuery),
    distinctUntilChanged((a, b) => a.page === b.page && a.pageSize === b.pageSize),
  );

  readonly #query = toSignal(this.#query$, {
    initialValue: { page: 1, pageSize: EVENT_LIST_DEFAULT_PAGE_SIZE },
  });

  protected readonly EVENT_CREATION_ROUTE = EVENT_ROUTING_LINKS.CREATION;
  protected readonly EVENT_COUNT_PLURAL = EVENT_COUNT_PLURAL;
  protected readonly EVENT_LIST_PAGE_SIZES = EVENT_LIST_PAGE_SIZES;

  protected readonly eventCategoriesEntityMap = this.#eventCategoryService.eventCategoriesEntityMap;
  protected readonly isLoading = signal(true);

  protected readonly events = toSignal(
    this.#query$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap((query) =>
        this.#eventService.getPaginated(query).pipe(finalize(() => this.isLoading.set(false))),
      ),
    ),
  );

  protected readonly pageIndex = computed(() => this.#query().page - 1);
  protected readonly pageSizeIndex = computed(() =>
    EVENT_LIST_PAGE_SIZES.findIndex((size) => size === this.#query().pageSize),
  );
  protected readonly pagesCount = computed(() =>
    Math.ceil((this.events()?.totalCount ?? 0) / this.#query().pageSize),
  );
  protected readonly showPageSize = computed(
    () => (this.events()?.totalCount ?? 0) > EVENT_LIST_DEFAULT_PAGE_SIZE,
  );
  protected readonly hasControls = computed(() => this.pagesCount() > 1 || this.showPageSize());

  constructor() {
    afterNextRender(() => {
      this.#eventCategoryService
        .getAll()
        .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
        .subscribe();
    });
  }

  protected goToPage(index: number): void {
    const page = index + 1;

    this.#updateQuery({ [EVENT_LIST_PAGE_QUERY_PARAM]: page === 1 ? null : page });
  }

  protected changePageSize(index: number): void {
    const pageSize = EVENT_LIST_PAGE_SIZES[index];

    if (pageSize === this.#query().pageSize) {
      return;
    }

    this.#updateQuery({
      [EVENT_LIST_PAGE_QUERY_PARAM]: null,
      [EVENT_LIST_SIZE_QUERY_PARAM]: pageSize === EVENT_LIST_DEFAULT_PAGE_SIZE ? null : pageSize,
    });
  }

  #updateQuery(queryParams: Params): void {
    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams,
      queryParamsHandling: 'merge',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function parseListQuery(params: ParamMap): ListQuery {
  const page = Number(params.get(EVENT_LIST_PAGE_QUERY_PARAM));
  const pageSize = Number(params.get(EVENT_LIST_SIZE_QUERY_PARAM));

  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    pageSize:
      EVENT_LIST_PAGE_SIZES.find((size) => size === pageSize) ?? EVENT_LIST_DEFAULT_PAGE_SIZE,
  };
}
