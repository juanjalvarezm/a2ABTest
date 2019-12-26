import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

export interface productos {
  nombre: string,
  precio: number,
  tipo: string,
  id: any;
  img: string;
  cantidad: any;
  estado: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {
  //variables
  productsArr: any = new Array();
  cart = [];
  cartItemCount = new BehaviorSubject(0);
  tasaUSD = 45000;
  constructor(
    private db: AngularFirestore,
    private router: Router
    ) { }

  
  getAllProductsFromMenu(_menuID) {
    this.productsArr.length = 0;
    this.db.collection('menu').doc(_menuID.toString()).collection('productos').snapshotChanges().subscribe(names => {
      names.map(name => {
        const data: productos = name.payload.doc.data() as productos;
        data.id = name.payload.doc.id;
        data.cantidad = 0;
        data.estado = false;
        this.productsArr.push(data);
      });
      console.log(this.productsArr);
      
    });
    return this.productsArr;
  }
  getCart(){
    return this.cart;
  }
  getCartItemCount(){
    return this.cartItemCount;
  }
  addProduct(product) {
    let added = false;
    for (let p of this.cart) {
      if (p.id == product.id) {
        p.cantidad += 1;
        added = true;
        p.estado = false;
        break
      }
    }
    if (added == false) {
      product.cantidad += 1;
      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1 );
  }
  decreaseProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id == product.id) {
        p.cantidad -= 1;
        if (p.cantidad == 0) {
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
  }
  removeProduct(product) {
    for (let [index, p] of this.cart.entries()){
      if (p.id == product.id){
        this.cartItemCount.next(this.cartItemCount.value - p.cantidad);
        p.cantidad = 0;
        this.cart.splice(index,1);
      }
    }
  }

}
