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
    this.productsArr = this.pServices.getAllProductsFromMenu();  //Trae la lista de productos (TODOS ELLOS).
    this.cart = this.pServices.getCart();                        //Trae el carrito de compras.
    this.cartItemCount = this.pServices.getCartItemCount();      //Trae el conteo de cosas del carrito.
    //Obtener informacion acerca de los productos que se encuentran actualmente en la CUENTA!
    this.pServices.setCart(this.data);  //Esta data viene de la cuenta que llamo a la clase productos.
  }
  addToCart(product){
    this.pServices.addProduct(product, this.data);
  }
  async openCart(){
    //Almacenar dichos datos obtenidos anteriormente.
    this.cart = this.pServices.getCart();
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
