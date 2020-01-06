import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { productos, ProductServicesService } from '../services/product-services.service';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';


interface detalleMesa{
  id: number;
  estado: boolean;
}

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
  productsArr: any  = new Array();
  detalleMesaArr: any = new Array();
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
  getTotal(){
    return this.cart.reduce( (i,j) => i + j.precio * j.cantidad, 0 );
  }
  getEstadoMesa(){
    console.log("DATA ID: "+this.data.id);
    this.db.collection('menu').doc(this.data.id).get().toPromise().then(
      function(doc){
        if(doc.exists){
          console.log("Document Data: ", doc.data());
        }//doc if
        else{
          console.log("No such document!");
        }//doc else
      }//doc function
    )//then parentesis
    .catch( 
      function(err){
        console.log("ERROR GETTING DOCUMENT!: ", err);
      }
    )//catch final
  }//final metodo


}
