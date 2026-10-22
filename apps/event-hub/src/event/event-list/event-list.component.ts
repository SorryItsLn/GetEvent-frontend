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
import { Event, EventApiService, EventCategoryApiService, MyEvent } from '@myorg/modules';
import { TuiButton } from '@taiga-ui/core';
import { TuiPagination, TuiSegmented, TuiTabs } from '@taiga-ui/kit';
import {
  Observable,
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

import {
  EVENT_COUNT_PLURAL,
  EVENT_LIST_DEFAULT_PAGE_SIZE,
  EVENT_LIST_FILTERS,
  EVENT_LIST_FILTER_QUERY_PARAM,
  EVENT_LIST_PAGE_QUERY_PARAM,
  EVENT_LIST_PAGE_SIZES,
  EVENT_LIST_SIZE_QUERY_PARAM,
  EVENT_ROUTING_LINKS,
  EventListFilter,
  PENDING_REGISTRATIONS_PLURAL,
} from '../consts';
import { EventCardComponent } from '../event-card';

type ListQuery = { filter: EventListFilter; page: number; pageSize: number };

type ListItem = Event & Partial<Pick<MyEvent, 'pendingCount' | 'confirmedCount'>>;

type ListPage = { items: ListItem[]; totalCount: number };

const TAB_FILTERS: EventListFilter[] = [EVENT_LIST_FILTERS.ALL, EVENT_LIST_FILTERS.MY];

@Component({
  selector: 'app-event-list',
  imports: [
    TuiButton,
    TuiPagination,
    TuiSegmented,
    TuiTabs,
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
    distinctUntilChanged(
      (a, b) => a.filter === b.filter && a.page === b.page && a.pageSize === b.pageSize,
    ),
  );

  readonly #query = toSignal(this.#query$, {
    initialValue: {
      filter: EVENT_LIST_FILTERS.ALL,
      page: 1,
      pageSize: EVENT_LIST_DEFAULT_PAGE_SIZE,
    },
  });

  protected readonly EVENT_CREATION_ROUTE = EVENT_ROUTING_LINKS.CREATION;
  protected readonly EVENT_COUNT_PLURAL = EVENT_COUNT_PLURAL;
  protected readonly EVENT_LIST_PAGE_SIZES = EVENT_LIST_PAGE_SIZES;
  protected readonly PENDING_REGISTRATIONS_PLURAL = PENDING_REGISTRATIONS_PLURAL;

  protected readonly eventCategoriesEntityMap = this.#eventCategoryService.eventCategoriesEntityMap;
  protected readonly isLoading = signal(true);

  protected readonly events = toSignal(
    this.#query$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap((query) =>
        this.#loadPage(query).pipe(
          catchError(() => of(null)),
          finalize(() => this.isLoading.set(false)),
        ),
      ),
    ),
  );

  protected readonly myEventsCount = toSignal(
    this.#eventService.getMy({ page: 1, pageSize: 1 }).pipe(
      map(({ totalCount }) => totalCount),
      catchError(() => of(null)),
    ),
    { initialValue: null },
  );

  protected readonly isMyFilter = computed(() => this.#query().filter === EVENT_LIST_FILTERS.MY);
  protected readonly tabIndex = computed(() => TAB_FILTERS.indexOf(this.#query().filter));
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

  protected changeFilter(index: number): void {
    const filter = TAB_FILTERS[index];

    if (filter === this.#query().filter) {
      return;
    }

    this.#updateQuery({
      [EVENT_LIST_FILTER_QUERY_PARAM]: filter === EVENT_LIST_FILTERS.ALL ? null : filter,
      [EVENT_LIST_PAGE_QUERY_PARAM]: null,
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

  #loadPage({ filter, page, pageSize }: ListQuery): Observable<ListPage> {
    return filter === EVENT_LIST_FILTERS.MY ?
        this.#eventService.getMy({ page, pageSize })
      : this.#eventService.getPaginated({ page, pageSize });
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
  const filter = params.get(EVENT_LIST_FILTER_QUERY_PARAM);

  return {
    filter: filter === EVENT_LIST_FILTERS.MY ? EVENT_LIST_FILTERS.MY : EVENT_LIST_FILTERS.ALL,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    pageSize:
      EVENT_LIST_PAGE_SIZES.find((size) => size === pageSize) ?? EVENT_LIST_DEFAULT_PAGE_SIZE,
  };
}
