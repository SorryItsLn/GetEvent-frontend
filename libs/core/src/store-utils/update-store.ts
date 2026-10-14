import { WritableStateSource, patchState } from '@ngrx/signals';
import { SelectEntityId, setEntities, setEntity } from '@ngrx/signals/entities';
import { MonoTypeOperatorFunction, Observable, tap } from 'rxjs';

export function updateStoreEntity<T, Collection extends string>(
  store: WritableStateSource<object>,
  entityConfig: { entity: T; collection: Collection; selectId: SelectEntityId<NoInfer<T>> },
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.pipe(tap((value) => patchState(store, setEntity(value, entityConfig))));
}

export function updateStoreEntities<T, Collection extends string>(
  store: WritableStateSource<object>,
  entityConfig: { entity: T; collection: Collection; selectId: SelectEntityId<NoInfer<T>> },
): MonoTypeOperatorFunction<T[]> {
  return (source: Observable<T[]>) =>
    source.pipe(tap((value) => patchState(store, setEntities(value, entityConfig))));
}
