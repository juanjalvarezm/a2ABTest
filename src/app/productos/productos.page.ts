import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ProductosModalPage } from '../productos-modal/productos-modal.page';
import { ProductServicesService } from '../services/product-services.service';



@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  //Variables
  productsArr: any = new Array;
  cart = [];
  cartItemCount : BehaviorSubject<number>;
  data: any;
  constructor(
    private router: Router,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private pServices: ProductServicesService,
    private route: ActivatedRoute ) { }

  ngOnInit() {
    if (this.route.snapshot.data['mesaDetalle'] ){
      this.data = this.route.snapshot.data['mesaDetalle'];
    }
    this.productsArr = this.pServices.getAllProductsFromMenu(1);
    this.cart = this.pServices.getCart();
    this.cartItemCount = this.pServices.getCartItemCount();  
  }
  addToCart(product){
    this.pServices.addProduct(product);
    
  }
  async openCart(){
    let modal = await this.modalCtrl.create({
      component: ProductosModalPage,
      cssClass: 'productos-modal',
      componentProps: {
        id: this.data.id,
      }
    });
    modal.present();
  }


}
