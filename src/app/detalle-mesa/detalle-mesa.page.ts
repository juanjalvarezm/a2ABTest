import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-mesa',
  templateUrl: './detalle-mesa.page.html',
  styleUrls: ['./detalle-mesa.page.scss'],
})
export class DetalleMesaPage implements OnInit {
  //Variables
  data : any;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if (this.route.snapshot.data['mesaDetalle'] ){
      this.data = this.route.snapshot.data['mesaDetalle'];
    }
  }

}
