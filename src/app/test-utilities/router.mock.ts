import { Router } from '@angular/router';

export function createMockRouter(): jasmine.SpyObj<Router> {
    return jasmine.createSpyObj('Router', ['navigate']);
}
