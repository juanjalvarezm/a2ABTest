import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { menu, productos, DatabaseService } from '../services/database.service';

interface areasPreparacion {
  id: any;
  name: string;
  mesas: Array<mesas>;
}
interface mesas {
  id: any;
  clientes: any;
  cuentas: any;
  estado: any;
  area: any;
  totalBS: any;
  totalUSD: any;
}
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  //Variables
  menus         : menu[]       = [];
  productos     : productos[]  = [];

  constructor(
    private router     : Router,
    private dataService: DataService,
    private db         : DatabaseService
  ) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(
      ready => {
        if(ready){
        
          this.db.getMenus().subscribe(
            menu =>{
              console.log("Menus: ", menu);
              this.menus = menu;
            }//Final Menu
          )//Final MenuSubscribe
          
          this.db.getProductos().subscribe(
            productos => {
              console.log("Productos: ", productos);
              this.productos = productos
            }//productos final
          )//subscribe final

        }//Final if

      }//Final Ready
    )//Final subscribe
  }


  /*getAreaPreparacion() {
    this.db.collection('areas').snapshotChanges().subscribe(names => {
      names.map(name => {
        const data: areasPreparacion = name.payload.doc.data() as areasPreparacion;
        data.id = name.payload.doc.id;
        data.mesas = []//Inicializacion necesaria para que se registre el arreglo dentro de la data
        this.tabsArr.push(data);
      });
      console.log(this.tabsArr);


    });
  }

  tableSelected(_number: number) {
    this.dataService.setData(_number, this.tabsArr[this.indice].mesas[_number]);
    this.router.navigateByUrl('detalle-mesa/' + _number);
  }

  goToTable(_number) {
    this.indice = _number;
    this.mesasSelected = true;
    this.tabsArr[_number].mesas.length = 0;
    //Query, de la coleccion de mesas para el area seleccionada
    
    this.db.collection('areas/' + this.tabsArr[_number].id + "/mesas").snapshotChanges().subscribe(names => {
      names.map(name => {
        const data: mesas = name.payload.doc.data() as mesas;
        data.id = name.payload.doc.id;
        data.area = this.tabsArr[_number].id;
        this.tabsArr[_number].mesas.push(data);
      });
      console.log(this.tabsArr[_number].mesas);
    });
  }*/


}