import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface flags{
  flags_id    : number ;
  descripcion : string ;
  estado      : boolean;
}
export interface menu{
  menu_id     : number;
  nombre      : string;
  descripcion : string;
}
export interface productos{
  productos_id : number;
  nombre       : string;
  estado       : number;
  precio       : number;
  imagen       : string;
}
export interface clientes{
  clientes_id : number;
  nombre      : string;
}
export interface areas{
  areas_id : number;
  nombre   : string;
  imagen   : string;
}
export interface usuarios{
  usuarios_id : number;
  mac         : string;
  nombre      : string;
}
export interface mesas{
  mesas_id   : number;
  capacidad  : number;
  estado     : number;
  usuarios_id: number;
  areas_id   : number;
  menus_id   : number;  
}
export interface cuentas{
  cuentas_id   : number;
  totalMoneda1 : number;
  totalMoneda2 : number;
  numeroCuenta : string;
  mesas_id     : number;
  clientes_id  : number;
}
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady : BehaviorSubject<boolean> = new BehaviorSubject(false);
  private flag    : flags //Para conocer si la app ya fue configurada con la base de datos.
  
  menus       = new BehaviorSubject([]);
  productos   = new BehaviorSubject([]);
  clientes    = new BehaviorSubject([]);
  areas       = new BehaviorSubject([]);
  usuarios    = new BehaviorSubject([]);
  mesas       = new BehaviorSubject([]);
  //Mesa de un area en especifico (varios datos)
  mesasOfArea = new BehaviorSubject([]);
  cuentas     = new BehaviorSubject([]);
  //soemthing like above   = new BehaviorSubject([]);

  constructor(
    private plt         : Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite      : SQLite,
    private http        : HttpClient
    ) {
    this.plt.ready().then(() => { //Creacion de base de datos
      this.sqlite.create({
        name    : 'a2-ab.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {    
          this.database = db;
          this.seedDatabase();  
      });
    });
  }

  seedDatabase() {
    this.http.get('assets/seed.sql', { responseType: 'text'})  //Ingresamos Las tablas y datos dentro de la base de datos
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
                /**
                 * Se debe hacer otro seed SQL para meter los inserts y el insert de estado se mete con el 
                 * SEED anterior. cuando se meta este segundo lo que hara es actualizar el estado y colocarlo
                 * en True. para asi chequearse y determinar si es necesario meter nuevamente la data a la 
                 * Base de Datos.
                 */
                  this.loadMenus();
                  this.loadProductos();
                  this.loadClientes();
                  this.loadAreas();
                  this.loadUsuarios();
                  this.loadMesas();
                  this.loadCuentas();
              })
          this.dbReady.next(true);
        });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  
  /**********ESTADO ********** */
  checkFlag(){
    return this.database.executeSql('SELECT * FROM flags', []).then(
      data => {
        this.flag = {
          flags_id    : data.rows.item(0).flags_id,
          descripcion : data.rows.item(0).descripcion,
          estado      : data.rows.item(0).estado        
        }
        return this.flag;
      }
    )//Final Then
  }
  updateFlag(){
    return this.database.executeSql('UPDATE flags SET estado = "true" WHERE flags_id="1"').then(
      data => {
        console.log('UPDATED!');
      }
    )
  }
  //***********ESTADO************** */
  
  //***********Menus************** */
  loadMenus(){
    return this.database.executeSql('SELECT * FROM menus', []).then(
      data => {
        let menus: menu[] = [];
        //this.menus.next(menus);
        if(data.rows.length > 0){
          for(var i = 0; i < data.rows.length; i++){
            menus.push({
              menu_id     : data.rows.item(i).menu_id,
              nombre      : data.rows.item(i).nombre,
              descripcion : data.rows.item(i).descripcion
            });//push final
          }//for final
        }//if final
        console.log(menus);
        this.menus.next(menus)
      })//then final
      .catch(
       e => {console.dir(e)} 
      );

  }//loadMenus final (function)
  getMenu(menu_id){
    return this.database.executeSql('SELECT * FROM menus WHERE menu_id = ? ', [menu_id]).then( 
      data => {
        return {
          menu_id     : data.rows.item(0).menu_id,
          nombre      : data.rows.item(0).nombre,
          descripcion : data.rows.item(0).descripcion
        }//Final Return
    });//Final Then
  }
  getMenus(): Observable<menu[]>{
    return this.menus.asObservable();
  }
  //***********Menus************** */

  //***********PRODUCTOS************** */
  loadProductos(){
    return this.database.executeSql('SELECT * FROM productos', []).then(
      data => {
        console.log(data);
        let productos: productos[] = [];
        if(data.rows.length > 0){
          for(var i = 0; i < data.rows.length; i++){
            productos.push({
              productos_id: data.rows.item(i).productos_id,
              nombre      : data.rows.item(i).nombre,
              estado      : data.rows.item(i).estado,
              precio      : data.rows.item(i).precio,
              imagen      : data.rows.item(i).imagen
            });//push final
          }//for final
        }//if final
        console.log(productos);
        this.productos.next(productos)
      })//then final
      .catch(
        e => {console.dir(e)} 
       );
  }//loadProducto final (function)

  getProducto(producto_id){
    return this.database.executeSql('SELECT * FROM productos WHERE productos_id = ? ', [producto_id]).then( 
      data => {
        return {
              productos_id: data.rows.item(0).productos_id,
              nombre      : data.rows.item(0).nombre,
              estado      : data.rows.item(0).estado,
              precio      : data.rows.item(0).precio,
              imagen      : data.rows.item(0).imagen
        }//Final Return
    });//Final Then
  }
  getProductos(): Observable<productos[]>{
    return this.productos.asObservable();
  }
  //***********PRODUCTOS************** */

  //***********CLIENTES************** */
  loadClientes(){
    return this.database.executeSql('SELECT * FROM clientes', []).then(
      data => {
        let clientes: clientes[] = [];

        if(data.rows.length > 0){
          for(var i = 0; i < data.rows.length; i++){
            clientes.push({
              clientes_id: data.rows.item(i).clientes_id,
              nombre      : data.rows.item(i).nombre
            });//push final
          }//for final
        }//if final
        this.clientes.next(clientes)
      });//then final

  }//loadClientes final (function)

  getCliente(clientes_id){
    return this.database.executeSql('SELECT * FROM clientes WHERE clientes_id = ? ', [clientes_id]).then( 
      data => {
        return {
              clientes_id: data.rows.item(0).clientes_id,
              nombre      : data.rows.item(0).nombre
        }//Final Return
    });//Final Then
  }
  getClientes(): Observable<clientes[]>{
    return this.clientes.asObservable();
  } 
  //***********CLIENTES************** */
  
  //***********AREAS************** */
  loadAreas(){
    return this.database.executeSql('SELECT * FROM areas', []).then(
      data => {
        let areas: areas[] = [];
        if(data.rows.length > 0){
          for(var i = 0; i < data.rows.length; i++){
            areas.push({
              areas_id    : data.rows.item(i).areas_id,
              nombre      : data.rows.item(i).nombre,
              imagen      : data.rows.item(i).imagen
            });//push final
          }//for final
        }//if final
        this.areas.next(areas)
      });//then final

  }//loadAreas final (function)

  getArea(areas_id){
    return this.database.executeSql('SELECT * FROM areas WHERE areas_id = ? ', [areas_id]).then( 
      data => {
        return {
              areas_id    : data.rows.item(0).areas_id,
              nombre      : data.rows.item(0).nombre,
              imagen      : data.rows.item(0).imagen
        }//Final Return
    });//Final Then
  } 
  getAreas(): Observable<areas[]>{
    return this.areas.asObservable();
  } 
  //***********AREAS************** */

  //***********USUARIOS************** */
  loadUsuarios(){
    return this.database.executeSql('SELECT * FROM usuarios', []).then(
      data => {
        let usuarios: usuarios[] = [];

        if(data.rows.length > 0){
          for(var i = 0; i < data.rows.length; i++){
            usuarios.push({
              usuarios_id : data.rows.item(i).usuarios_id,
              mac         : data.rows.item(i).mac,
              nombre      : data.rows.item(i).nombre
            });//push final
          }//for final
        }//if final
        this.usuarios.next(usuarios)
      });//then final

  }//loadUsuarios final (function)

  getUsuario(usuarios_id){
    return this.database.executeSql('SELECT * FROM usuarios WHERE usuarios_id = ? ', [usuarios_id]).then( 
      data => {
        return {
          usuarios_id : data.rows.item(0).usuarios_id,
          mac         : data.rows.item(0).mac,
          nombre      : data.rows.item(0).nombre
        }//Final Return
    });//Final Then
  } 
  getUsuarios(): Observable<usuarios[]>{
    return this.usuarios.asObservable();
  } 
  //***********USUARIOS************** */

  //***********MESAS************** */
  loadMesas(){
    return this.database.executeSql('SELECT * FROM mesas', []).then(
      data => {
        let mesas: mesas[] = [];

        if(data.rows.length > 0){
          for(var i = 0; i < data.rows.length; i++){
            mesas.push({
              mesas_id   : data.rows.item(i).mesas_id,
              capacidad  : data.rows.item(i).capacidad,
              estado     : data.rows.item(i).estado,
              usuarios_id: data.rows.item(i).usuarios_id,
              areas_id   : data.rows.item(i).areas_id,
              menus_id   : data.rows.item(i).menus_id
            });//push final
          }//for final
        }//if final
        this.mesas.next(mesas)
      });//then final

  }//loadMesas final (function)

  getMesa(mesas_id){
    return this.database.executeSql('SELECT * FROM mesas WHERE mesas_id = ?', [mesas_id]).then( 
      data => {
        return {
          mesas_id   : data.rows.item(0).mesas_id,
          capacidad  : data.rows.item(0).capacidad,
          estado     : data.rows.item(0).estado,
          usuarios_id: data.rows.item(0).usuarios_id,
          areas_id   : data.rows.item(0).areas_id,
          menus_id   : data.rows.item(0).menus_id
        }//Final Return
    });//Final Then
  } 

  getMesasOfArea(areas_id){
    return this.database.executeSql('SELECT * FROM mesas WHERE areas_id = ?', [areas_id]).then(
      data => {
        let mesasOfArea: mesas[] = [];
        if(data.rows.length > 0){
          for(var i = 0; i < data.rows.length; i++){
            mesasOfArea.push({
              mesas_id   : data.rows.item(i).mesas_id,
              capacidad  : data.rows.item(i).capacidad,
              estado     : data.rows.item(i).estado,
              usuarios_id: data.rows.item(i).usuarios_id,
              areas_id   : data.rows.item(i).areas_id,
              menus_id   : data.rows.item(i).menus_id
            });//push final
          }//for final
        }
      this.mesasOfArea.next(mesasOfArea);
      });//Final then
  }

  getMesas(): Observable<mesas[]>{
    return this.mesas.asObservable();
  } 
  //Mesas of Area. (Varios datos formateados en un arreglo)
  getMesasofAreaBS(): Observable<mesas[]>{
    return this.mesasOfArea.asObservable();
  }
  //***********MESAS************** */

  //***********CUENTAS************** */
  loadCuentas(){
    return this.database.executeSql('SELECT * FROM cuentas', []).then(
      data => {
        let cuentas: cuentas[] = [];

        if(data.rows.length > 0){
          for(var i = 0; i < data.rows.length; i++){
            cuentas.push({
              cuentas_id   : data.rows.item(i).cuentas_id,
              totalMoneda1 : data.rows.item(i).totalMoneda1,
              totalMoneda2 : data.rows.item(i).totalMoneda2,
              numeroCuenta : data.rows.item(i).numeroCuenta,
              mesas_id     : data.rows.item(i).mesas_id,
              clientes_id  : data.rows.item(i).clientes_id
            });//push final
          }//for final
        }//if final
        this.cuentas.next(cuentas)
      });//then final

  }//loadCuentas final (function)

  getCuenta(cuentas_id){
    return this.database.executeSql('SELECT * FROM cuentas WHERE cuentas_id = ? ', [cuentas_id]).then( 
      data => {
        return {
          cuentas_id   : data.rows.item(0).cuentas_id,
          totalMoneda1 : data.rows.item(0).totalMoneda1,
          totalMoneda2 : data.rows.item(0).totalMoneda2,
          numeroCuenta : data.rows.item(0).numeroCuenta,
          mesas_id     : data.rows.item(0).mesas_id,
          clientes_id  : data.rows.item(0).clientes_id
        }//Final Return
    });//Final Then
  } 
  getCuentas(): Observable<cuentas[]>{
    return this.cuentas.asObservable();
  } 
  //***********CUENTAS************** */
}
