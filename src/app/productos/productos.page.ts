import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ProductosModalPage } from '../productos-modal/productos-modal.page';
import { ProductServicesService, productos } from '../services/product-services.service';
import { DatabaseService, cuentasProductos } from '../services/database.service';



@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  //Variables
  productsArr   : any                 = new Array;
  cart          :  cuentasProductos[] = []
  cartItemCount : BehaviorSubject<number>;
  data          : any;
  producto      : productos;
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private pServices: ProductServicesService,
    private route: ActivatedRoute,
    private db         : DatabaseService ) { }

  ngOnInit() {

    if (this.route.snapshot.data['mesaDetalle'] ){
      this.data = this.route.snapshot.data['mesaDetalle'];
    }
    //Esta data viene de la cuenta que llamo a la clase productos.
    //                     .........
    this.pServices.setCart(this.data).then(data => {
      if(data.length > 0){
        for(let i = 0; i < data.length; i++){
          this.cart.push(data[i]);
        }
      }
    });
    this.pServices.CartFromDatabase = this.cart;
    //Trae la lista de productos (TODOS ELLOS).
    this.productsArr = this.pServices.getAllProductsFromMenu();
    //Se toma el valor inicial del cartItemCount, el cual esta en "0"
    this.cartItemCount = this.pServices.getCartItemCount();
    //Evaluamos todo el carrito guardado en la base de datos
    for(var i = 0; i < this.cart.length; i++){
      //Se ingresan las cantidades de cada producto dentro de esta cuenta.
      if(this.cartItemCount.value == 0){
        this.cartItemCount.next(this.cart[i].cantidad);
      }
    }

  }
  addToCart(product){
    this.pServices.addProduct(product, this.data);
  }
  async openCart(){
    //Almacenar dichos datos obtenidos anteriormente.
    let modal = await this.modalCtrl.create({
      component: ProductosModalPage,
      cssClass: 'productos-modal',
      componentProps: {
        cuentas_id         : this.data.cuentas_id
      }
    });
    modal.present();
  }


}
