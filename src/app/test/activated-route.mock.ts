import { ParamMap, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { PartialMock } from './mock';

export interface ParamMapData { [name: string]: string | string[]; }

class MockParamMap implements ParamMap {

  public constructor(private data: ParamMapData) { }

  public get keys(): string[] {
    return Object.keys(this.data);
  }

  public get(name: string): string | null {
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

  public getAll(name: string): string[] {
    const param = this.data[name];
    if (typeof param === 'string') {
      return [param];
    } else if (param instanceof Array) {
      return param;
    }
    return [];
  }

  public has(name: string): boolean {
    const param = this.data[name];
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

  public constructor({ mockParamMap, mockQueryParamMap }: MockActivatedRouteSnapshotCreator = {}) {
    this.paramMapInternal = new MockParamMap(mockParamMap ? mockParamMap : {});
    this.queryParamMapInternal = new MockParamMap(mockQueryParamMap ? mockQueryParamMap : {});
  }

  public get paramMap(): ParamMap {
    return this.paramMapInternal;
  }

  public get queryParamMap(): ParamMap {
    return this.queryParamMapInternal;
  }
}

export class MockActivatedRoute implements PartialMock<ActivatedRoute> {

  private snapshotSubject = new BehaviorSubject<MockActivatedRouteSnapshot | undefined>(undefined);
  public readonly snapshot$ = this.snapshotSubject.pipe(filter(
    value => value !== undefined
  )) as Observable<MockActivatedRouteSnapshot>;

  public get paramMap(): Observable<ParamMap> {
    return this.snapshot$.pipe(map(snapshot => snapshot.paramMap));
  }

  public get queryParamMap(): Observable<ParamMap> {
    return this.snapshot$.pipe(map(snapshot => snapshot.queryParamMap));
  }

  public get snapshot(): MockActivatedRouteSnapshot | undefined {
    return this.snapshotSubject.value;
  }

  public pushSnapshot(snapshot: MockActivatedRouteSnapshot): void {
    this.snapshotSubject.next(snapshot);
  }

  public pushSnapshotWithData(snapshotCreator: MockActivatedRouteSnapshotCreator = {}): void {
    this.pushSnapshot(new MockActivatedRouteSnapshot(snapshotCreator));
  }
}
