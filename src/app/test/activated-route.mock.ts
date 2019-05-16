import { ParamMap, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { PartialMock } from './mock';

export interface ParamMapData { [name: string]: string | string[]; }

class MockParamMap implements ParamMap {

  constructor(private data: ParamMapData) { }

  get keys(): string[] {
    return Object.keys(this.data);
  }

  get(name: string): string | null {
    const param = this.data[name];
    if (typeof param === 'string') {
      return param;
    } else if (param instanceof Array) {
      if (param.length === 0) {
        return null;
      }
      return param[0];
    }
    return null;
  }

  getAll(name: string): string[] {
    const param = this.data[name];
    if (typeof param === 'string') {
      return [param];
    } else if (param instanceof Array) {
      return param;
    }
    return [];
  }

  has(name: string): boolean {
    const param  = this.data[name];
    if (param) {
      if (param instanceof Array) {
        return param.length !== 0;
      }
      return true;
    } else {
      return false;
    }
  }
}

export interface MockActivatedRouteSnapshotCreator {
  mockParamMap?: ParamMapData;
  mockQueryParamMap?: ParamMapData;
}

export class MockActivatedRouteSnapshot implements PartialMock<ActivatedRouteSnapshot> {

  private paramMapInternal: ParamMap;
  private queryParamMapInternal: ParamMap;

  constructor({ mockParamMap, mockQueryParamMap }: MockActivatedRouteSnapshotCreator = {}) {
    this.paramMapInternal = new MockParamMap(mockParamMap ? mockParamMap : {});
    this.queryParamMapInternal = new MockParamMap(mockQueryParamMap ? mockQueryParamMap : {});
  }

  get paramMap(): ParamMap {
    return this.paramMapInternal;
  }

  get queryParamMap(): ParamMap {
    return this.queryParamMapInternal;
  }
}

export class MockActivatedRoute implements PartialMock<ActivatedRoute> {

  snapshot$ = new BehaviorSubject<MockActivatedRouteSnapshot>(new MockActivatedRouteSnapshot());

  get paramMap(): Observable<ParamMap> {
    return this.snapshot$.pipe(map(snapshot => snapshot.paramMap));
  }

  get queryParamMap(): Observable<ParamMap> {
    return this.snapshot$.pipe(map(snapshot => snapshot.queryParamMap));
  }

  get snapshot(): MockActivatedRouteSnapshot {
    return this.snapshot$.value;
  }

  pushSnapshot(snapshot: MockActivatedRouteSnapshot) {
    this.snapshot$.next(snapshot);
  }

  pushSnapshotWithData(snapshotCreator: MockActivatedRouteSnapshotCreator = {}) {
    this.pushSnapshot(new MockActivatedRouteSnapshot(snapshotCreator));
  }
}
