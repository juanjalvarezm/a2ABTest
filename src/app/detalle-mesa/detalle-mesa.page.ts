import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductServicesService } from '../services/product-services.service';
import { DataService } from '../services/data.service';
import { DatabaseService, cuentas, cuentasProductos} from '../services/database.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-detalle-mesa',
  templateUrl: './detalle-mesa.page.html',
  styleUrls: ['./detalle-mesa.page.scss'],
})
export class DetalleMesaPage implements OnInit {
  //Variables
  data          : any;
  cart          : cuentasProductos[] = [];
  tasaUSD       : number;
  productsArr   : any[]              = [];
  detalleMesaArr: any[]              = [];
  cuentasOfMesa : cuentas[]          = [];
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
    this.tasaUSD = this.pServices.tasaUSD;
    this.dataService.getCuentasOfMesas(this.data).then(data => {
      if(data.length > 0){
        this.cuentasOfMesa = data;
        for(let i = 0; i < data.length; i++){
          this.pServices.setCart(data[i]).then(data => {
            this.cart = data;
            console.log("dataCart DATABASE ", data);
          });
        }
      }
    });
    //this.presentAlertConfirm();
  }
  goToProducts(){
    this.dataService.setData(0, this.cuentasOfMesa[0]);      //Falta es obtener el id de la cuenta desde la interfaz.(Slides)
    this.router.navigateByUrl('productos/' + 0);
  }
  getTotal(){
    return this.cart.reduce( (i,j) => i + j.producto_precio * j.cantidad, 0 );
  }
  refreshFactura(){
    this.ngOnInit();
  }
}

