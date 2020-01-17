import { Injectable } from '@angular/core';
import { DatabaseService, areas, mesas } from './database.service';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  //Variables
  private data            = [];
  private areas : areas[] = [];
  private mesas : mesas[] = []
  constructor(
    private db : DatabaseService
  ) { }

  setData(id, _data){
    this.data[id] = _data;
  }
  getData(id){
    return this.data[id]
  }
  getAreasFromDatabase(){
    this.db.loadAreas();
    this.areas = this.db.getAreas();
    return this.areas;
  }
  getMesasOfArea(nombreArea:string){
   return this.db.getMesasOfArea(nombreArea).then(data => {
      return this.db.getMesasofAreaBS();
    })
  }
  getCuentasOfMesas(data:mesas){
    return this.db.getCuentasOfMesa(data.mesas_id).then(data => {
      return this.db.getCuentasOfMesaBS();
    })
  }

}
