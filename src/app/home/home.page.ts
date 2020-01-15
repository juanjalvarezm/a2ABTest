import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService, areas } from '../services/database.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage{
  areas        : areas[] = [];
  constructor(
    private router: Router,
    private db    : DatabaseService) {}
  goToInicio(){
    this.router.navigateByUrl('inicio');
  }



}
