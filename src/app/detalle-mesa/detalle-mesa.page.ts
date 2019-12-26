import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { productos, ProductServicesService } from '../services/product-services.service';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-detalle-mesa',
  templateUrl: './detalle-mesa.page.html',
  styleUrls: ['./detalle-mesa.page.scss'],
})
export class DetalleMesaPage implements OnInit {
  //Variables
  data : any;
  cart: productos[];
  tasaUSD: number;
  constructor(
    private pServices :  ProductServicesService, 
    private route: ActivatedRoute, 
    private router: Router,
    private dataService: DataService,
    private db: AngularFirestore) { }

  ngOnInit() {
    if (this.route.snapshot.data['mesaDetalle'] ){
      this.data = this.route.snapshot.data['mesaDetalle'];
    }
    this.cart = this.pServices.cart;
    this.tasaUSD = this.pServices.tasaUSD;
  }
  goToProducts(){
    this.dataService.setData(0, this.data);
    this.router.navigateByUrl('productos/' + 0);
  }
  enviarPedido(){
    for(let i = 0; i < this.cart.length; i++){
      if (this.cart[i].estado == false){
        this.cart[i].estado = true;
        this.db
        .collection('areas')
        .doc('fGZyfhMU85Di38gbQO6o')
        .collection('mesas')
        .doc('1')
        .collection('cuentas')
        .doc('1')
        .collection('productos')
        .add(this.cart[i]);
      }
    }
  }
  getTotal(){
    return this.cart.reduce( (i,j) => i + j.precio * j.cantidad, 0 );
  }


}
