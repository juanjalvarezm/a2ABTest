import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { areas, mesas, DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  //Variables
  areas         : areas[] = [];
  mesas         : mesas[] = [];
  mesasSelected : boolean = false;
  constructor(
    private router     : Router,
    private dataService: DataService,
    private db         : DatabaseService
  ) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(
      ready => {
        if(ready){  //Sabemos que ya la base de datos esta lista para extraer datos.
          this.areas = this.dataService.getAreasFromDatabase();
        }//Final if
      }//Final Ready
    )//Final subscribe
  }

  /**
   * Este metodo toma el id del area seleccionada y lo pasa al query y selecciona las mesas que se encuentran en esa area
   */
  goToArea(id){
        this.dataService.getMesasOfArea(this.areas[id].nombre).then(data =>{
          if(data.length > 0){
            this.mesas = data;
          }
        });
        this.mesasSelected = true;
  }//Final goToArea

  goToMesa(id){
    this.dataService.setData(id, this.mesas[id]);
    this.router.navigateByUrl('/detalle-mesa/'+id);
  }

}
