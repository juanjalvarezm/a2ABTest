import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { productos, ProductServicesService } from '../services/product-services.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { cuentasProductos } from '../services/database.service';

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
    private afAuth: AngularFireAuth,
    private db: AngularFirestore) { }

  ngOnInit() {
    this.cart = this.pServices.getCart();
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
    this.pServices.getDatabaseCart();
    this.modalCtrl.dismiss();
  }


}
