import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ResolverService implements Resolve<any> {

  constructor(private dataService : DataService) { }

  resolve(route: ActivatedRouteSnapshot){
    let id = route.paramMap.get('id');
    return this.dataService.getData(id);
  }
}
