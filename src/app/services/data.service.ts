import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  //Variables
  private data = [];
  
  constructor() { }

  setData(id, _data){
    this.data[id] = _data;
  }
  getData(id){ 
    return this.data[id]
  }
}
