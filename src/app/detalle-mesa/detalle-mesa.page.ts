import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { productos, ProductServicesService } from '../services/product-services.service';
import { DataService } from '../services/data.service';
import { DatabaseService, cuentas, cuentasProductos} from '../services/database.service';
import { Observable } from 'rxjs';
import { async } from '@angular/core/testing';
import { log } from 'util';
import { AlertController } from '@ionic/angular';


interface detalleMesa{
  id: number;
  estado: boolean;
}

@Component({
  selector: 'app-detalle-mesa',
  templateUrl: './detalle-mesa.page.html',
  styleUrls: ['./detalle-mesa.page.scss'],
})
export class DetalleMesaPage implements OnInit {
  //Variables
  data          : any;
  cart          : cuentasProductos[];
  tasaUSD       : number;
  productsArr   : any[] = [];
  detalleMesaArr: any[] = [];
  cuentasOfMesa : cuentas[] = [];
  cuentas       : any[] = [];
  constructor(
    private pServices  : ProductServicesService, 
    private route      : ActivatedRoute, 
    private router     : Router,
    private dataService: DataService,
    private db         : DatabaseService,
    public aController : AlertController) { }

  ngOnInit() {
    if (this.route.snapshot.data['mesaDetalle'] ){
      this.data = this.route.snapshot.data['mesaDetalle'];
    }
    this.cart    = this.pServices.cart;
    this.tasaUSD = this.pServices.tasaUSD;
    this.setCuentas();
    this.presentAlertConfirm();
  }
  goToProducts(){
    let cuentas = this.getCuentas();  //Esta data viene de la cuenta que llamo a la clase productos.
    this.pServices.databaseCart(cuentas[0]);
    this.dataService.setData(0, cuentas[0]);      //Falta es obtener el id de la cuenta desde la interfaz.(Slides)
    this.router.navigateByUrl('productos/' + 0);
  }
  getTotal(){
    //return this.cart.reduce( (i,j) => i + j.producto_precio * j.cantidad, 0 );
  }
  getEstadoMesa(){
  }//final metodo
  setCuentas(){
    this.db.getCuentasOfMesa(this.data.mesas_id);
    this.db.getCuentasOfMesaBS().subscribe(data=>{
      if(data.length > 0){
        this.cuentasOfMesa = data;
      }
    });
  }
  getCuentas(){
    return this.cuentasOfMesa
  }   
  async presentAlertConfirm() {
    const alert = await this.aController.create({
      header: 'Ingresar a la Mesa' + this.data.mesas_id,
      message: '¿Estas seguro de ingresar a la mesa?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: back => {
            this.router.navigateByUrl('/inicio');
          }
        }, {
          text: 'SI',
          handler: () => {
            this.getCuentas();
          }
        }
      ]
    });

    await alert.present();
  }
}

