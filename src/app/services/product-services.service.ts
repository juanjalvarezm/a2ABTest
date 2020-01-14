import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DatabaseService, cuentasProductos } from './database.service';

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
  tasaUSD                             = 45000;
  cuentaProducto : cuentasProductos[] = [];
  CartFromDatabase                    = [];
  constructor(
    private db    : DatabaseService,
    private router: Router
    ) { }

  
  getAllProductsFromMenu() {                                   //Falta pasarle el menu que esta activo para                                                                    dicha mesa
    this.db.getProductos().subscribe(producto=>{
        this.productsArr = producto;
      });
    return this.productsArr;  
  }
  getCartItemCount(){
    return this.cartItemCount;
  }
  setCart(data){
    this.db.getCuentasProductos(data.cuentas_id); //Data proviene de la cuenta que llamo la clase productos de                                                  la cual se necesita solo el id de la cuenta para buscar los                                                 productos que estan dentro de ella y meterlos en el carrito.
    this.db.getCuentasProductosBS().subscribe(data => {
      if(data.length > 0){
        this.cuentaProducto = data;
      }
    });
  }
  getCart(){
    return this.cuentaProducto;
  }
  addProduct(product, data) {
    let added = false;                             //Se establece un flag para saber si ya el producto esta o                                                    no en la cuenta del carrito.
    let cuentaProducto: cuentasProductos ={        //Verifica la data que se va almacenar en el carrito y la                                                     ordena para que no existan problemas con la base de datos.
      cuentas_id      : data.cuentas_id,
      producto_id     : product.productos_id,
      producto_nombre : product.nombre,
      producto_precio : product.precio,
      cantidad        : 1 
    }
      for(let p of this.cuentaProducto){                     //Checa lo que tiene el carrito.
        if(p.producto_id == product.productos_id){ //va comparando producto a producto con el seleccionado
          console.log("p.producto_id:"+p.producto_id+" y product.producto_id: "+product.productos_id);
          p.cantidad += 1;                         //Le suma una unidad al producto que ya esta en el carrito.
          //UPDATE
          added = true;                            //Cambia el estado al producto y dice que ya estaba incluido.
          break;                                   
        }//Final if (p.producto_id...)
      }//Final for
      if(added == false){                         //Verifica si el producto no estaba incluido en el carrito
        product.cantidad += 1;                    //Como no esta incluido, lo ingresa al carrito y le suma una                                              unidad 
        //INSERT
        this.cuentaProducto.push(cuentaProducto);           //Ingresa el producto previamente formateado al carrito.
      }
      this.cartItemCount.next(this.cartItemCount.value + 1);//Suma una cuenta al indicador del NAV que esta en                                                          la interfaz
    //YA INGRESA LA DATA AL CARRITO DE MANERA PROVISIONAL. FALTA INGRESARLA A BASE DE DATOS.
  }
  increaseProduct(product){
    for(let p of this.cuentaProducto){
      if (p.producto_id == product.producto_id){
        p.cantidad += 1;
        break;
      }
    }
    this.cartItemCount.next(this.cartItemCount.value + 1);
  }
  decreaseProduct(product) {
    for (let [index, p] of this.cuentaProducto.entries()) {
      if (p.producto_id == product.producto_id) {
        p.cantidad -= 1;
        if (p.cantidad == 0) {
          this.cuentaProducto.splice(index, 1);
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
  databaseCart(data){
    this.db.loadCuentasProductos(data.cuentas_id);
    this.db.getCuentasProductosRegularBS().subscribe(data=>{
      if(data.length > 0){
        this.CartFromDatabase = data;
      }
    });//Final subscribe y data
  }
  getDatabaseCart(){
    console.log("DataBaseCart:",this.CartFromDatabase);
    return this.CartFromDatabase;
  }
  

}
