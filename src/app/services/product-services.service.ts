import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService, cuentasProductos } from './database.service';
import { ToastController } from '@ionic/angular';

export interface productos {
  cuentas_id            : number;
  producto_id           : number;
  producto_nombre       : string;
  producto_precio       : number;
  cantidad              : number;
}
@Injectable({
  providedIn: 'root'
})
export class ProductServicesService {
  //variables
  productsArr                         = [];
  cart           : cuentasProductos[] = [];
  cartItemCount                       = new BehaviorSubject(0);
  tasaUSD                             = 80000;
  //cuentaProducto : cuentasProductos[] = [];
  CartFromDatabase                    = [];
  constructor(
    private db             : DatabaseService,
    private router         : Router,
    private toastController: ToastController
    ) { }


  getAllProductsFromMenu() {                                   //Falta pasarle el menu que esta activo
    this.db.loadProductos();
    this.productsArr = this.db.getProductos();
    return this.productsArr;
  }

  getCartItemCount(){
    return this.cartItemCount;
  }
  setCart(data){
    //Data proviene de la cuenta que llamo la clase productos de la cual se necesita solo el id de la cuenta para buscar los productos que estan dentro de ella y meterlos en el carrito.
    return this.db.getCuentasProductos(data.cuentas_id).then(data => {
      return this.db.getCuentasProductosBS();
    });
  }
  addProduct(product, data) {
    //Se establece un flag para saber si ya el producto esta o no en la cuenta del carrito.
    let added = false;
    //Verifica la data que se va almacenar en el carrito y la ordena para que no existan problemas con la base de datos.
    let cuentaProducto: cuentasProductos ={
      cuentas_id      : data.cuentas_id,
      producto_id     : product.productos_id,
      producto_nombre : product.nombre,
      producto_precio : product.precio,
      cantidad        : 1
    }
      for(let p of this.cart){                     //Checa lo que tiene el carrito.
        if(p.producto_id == product.productos_id){ //va comparando producto a producto con el seleccionado
          p.cantidad += 1;                         //Le suma una unidad al producto que ya esta en el carrito.
          added = true;                            //Cambia el estado al producto y dice que ya estaba incluido.
          break;
        }//Final if
      }//Final for
      if(added == false){                         //Verifica si el producto no estaba incluido en el carrito
        product.cantidad += 1;                    //Como no esta incluido, lo ingresa al carrito y le suma una
        this.cart.push(cuentaProducto);           //Ingresa el producto previamente formateado al carrito.
      }
      this.cartItemCount.next(this.cartItemCount.value + 1);
      this.presentToastWithOptions();
    //YA INGRESA LA DATA AL CARRITO DE MANERA PROVISIONAL. FALTA INGRESARLA A BASE DE DATOS.
  }
  increaseProduct(product){
    for(let p of this.cart){
      if (p.producto_id == product.producto_id){
        p.cantidad += 1;
        break;
      }
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);
  }
  decreaseProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.producto_id == product.producto_id) {
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
      if (p.producto_id == product.producto_id){
        //this.cartItemCount.next(this.cartItemCount.value - p.cantidad);
        p.cantidad = 0;
        this.cart.splice(index,1);
      }
    }
  }
  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Item guardado en la cuenta!',
      message: 'Haz click en el icono para ver mas',
      position: 'bottom',
      buttons: [
        {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
}
