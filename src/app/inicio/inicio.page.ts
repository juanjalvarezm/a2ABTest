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

  constructor(
    private router     : Router,
    private dataService: DataService,
    private db         : DatabaseService
  ) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(
      ready => {   
        if(ready){  //Sabemos que ya la base de datos esta lista para extraer datos.
          this.db.getAreas().subscribe(   //Datos de las areas de mesa.
            area =>{
              console.log("Areas: ", area); //Debug
              this.areas = area;
            }//Final Menu
          )//Final MenuSubscribe
          
          this.db.getMesas().subscribe(//Datos de las mesas que existen en el restaurant.
            mesas => {
              console.log("Mesas: ", mesas);//Debug
              this.mesas = mesas
            }//productos final
          )//subscribe final

        }//Final if

      }//Final Ready
    )//Final subscribe
  }


}
