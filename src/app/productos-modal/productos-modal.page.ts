import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { productos, ProductServicesService } from '../services/product-services.service';
import { Router } from '@angular/router';
import { cuentasProductos, DatabaseService } from '../services/database.service';
import { database } from 'firebase';

@Component({
  selector: 'app-productos-modal',
  templateUrl: './productos-modal.page.html',
  styleUrls: ['./productos-modal.page.scss'],
})
export class ProductosModalPage implements OnInit {
  //Variables
  cart: cuentasProductos[] = [];
  cartFromDB = [];
  @Input() cuentas_id:any;
  constructor(
    private pServices : ProductServicesService,
    private modalCtrl: ModalController,
    private router: Router,
    private db: DatabaseService) { }

  ngOnInit() {
    this.cart = this.pServices.cart;
    this.cartFromDB = this.pServices.CartFromDatabase;
  }
  decreaseCartItem(product){
    this.pServices.decreaseProduct(product);
  }
  increaseCartItem(product){                    //Checar esto! Problema con el "DATA";
    this.pServices.increaseProduct(product);
  }
  removeCartItem(product){
    this.pServices.removeProduct(product);
  }
  getTotal(){
    //return this.cart.reduce( (i,j) => i + j.precio * j.cantidad, 0 );
  }
  close(){
    console.log("this.cart", this.cart);
    console.log("this.cartFromDB", this.cartFromDB);
    this.modalCtrl.dismiss();
  }


}
