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
  usuario    : string;
  area       : string;
  menu       : string;
}
export interface cuentas{
  cuentas_id   : number;
  totalMoneda1 : number;
  totalMoneda2 : number;
  numeroCuenta : string;
  mesas_id     : number;
  clientes_id  : number;
}
export interface cuentasProductos{
  cuentas_id     : number;
  producto_id    : number;
  producto_nombre: string;
  producto_precio: number;
  cantidad       : number;
}
export interface cuentasProductosRegular{
  cuentas_productos_id,
  cuentas_id,
  productos_id,
  cantidad: number
}
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady : BehaviorSubject<boolean> = new BehaviorSubject(false);
  private flag    : flags //Para conocer si la app ya fue configurada con la base de datos.

  menus                   : menu                   []        = [];
  productos               : productos              []        = [];
  clientes                : clientes               []        = [];
  areas                   : areas                  []        = [];
  usuarios                : usuarios               []        = [];
  mesas                   : mesas                  []        = [];
  //Mesa de un area en especifico (varios datos)
  mesasOfArea             : mesas                  []        = [];
  cuentas                 : cuentas                []        = [];
  //Productos pertenecientes a una cuenta
  cuentasProductos        : cuentasProductos       []        = [];
  cuentasProductosRegular : cuentasProductosRegular[]        = [];
  //Cuentas de una mesa en especifico.
  cuentasOfMesa           :cuentas                 []        = [];
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
    this.http.get('assets/seed.sql', { responseType: 'text'})  //Ingresamos Las tablas
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {

                this.checkFlag().then(  //Chequea el flag a ver si esta en true o false para meter la data.
                  flag => {
                    if(flag.estado){
                      console.log('Ya esta configurado'); ///Debug
                      this.loadMenus();
                      this.loadProductos();
                      this.loadClientes();
                      this.loadAreas();
                      this.loadUsuarios();
                      this.loadMesas();
                      this.loadCuentas();
                    }else{
                      this.seedDATA(); //Ingresa la data.
                    }//Final Else
                  }//Fninal flag
                )//Final Then(flag)


              })//Final then(_)
          this.dbReady.next(true);
        });
  }

  getDatabaseState() { //Para conocer si la base de datos ya tiene tablas y datos.
    return this.dbReady.asObservable();
  }

  seedDATA(){//Para ingresar la data.
    this.http.get('assets/seed2.sql', {responseType: 'text'}) //Lee el seed2.sql (donde estan los inserts dentro de la carpeta assets).
    .subscribe(
      sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql) //dentro de la base de datos "this.database" ingresa el sql que acabamos de leer.
        .then(_ => {
                 //Aqui se cargan todos los datos de la base de datos al programa una vez ya son ingresados en la base de datos.
                  this.loadMenus();
                  this.loadProductos();
                  this.loadClientes();
                  this.loadAreas();
                  this.loadUsuarios();
                  this.loadMesas();
                  this.loadCuentas();
        })//Final Then (_)
      }//Final Sql
    )//Final Subscribe
  }

  /**********ESTADO ********** */
  checkFlag(){
    return this.database.executeSql('SELECT * FROM flags', []).then(
      data => {
        return {
          flags_id    : data.rows.item(0).flags_id,
          descripcion : data.rows.item(0).descripcion,
          estado      : data.rows.item(0).estado
        };
      }
    )//Final Then
  }
  updateFlag(){
    this.database.open();
    return this.database.executeSql('UPDATE flags SET estado = "true" WHERE flags_id="1"').then(
      data => {
        console.log('UPDATED!');
      })
  }
  //***********ESTADO************** */

  //***********Menus************** */
  loadMenus(){
    this.database.open();
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
        this.menus = menus;
      })//then final
      .catch(
       e => {console.dir(e)}
      );

  }//loadMenus final (function)
  getMenu(menu_id){
    this.database.open();
    return this.database.executeSql('SELECT * FROM menus WHERE menu_id = ? ', [menu_id]).then(
      data => {
        return {
          menu_id     : data.rows.item(0).menu_id,
          nombre      : data.rows.item(0).nombre,
          descripcion : data.rows.item(0).descripcion
        }//Final Return
    });//Final Then
  }
  getMenus(){
    return this.menus;
  }
  //***********Menus************** */

  //***********PRODUCTOS************** */
  loadProductos(){
    this.database.open();
    return this.database.executeSql('SELECT * FROM productos', []).then(
      data => {
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
        this.productos = productos;
      })//then final
      .catch(
        e => {console.dir(e)}
       );
  }//loadProducto final (function)

  getProducto(producto_id){
    this.database.open();
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
  getProductos(){
    console.log("this.productos", this.productos);
    return this.productos;
  }
  //***********PRODUCTOS************** */

  //***********CLIENTES************** */
  loadClientes(){
    this.database.open();
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
        this.clientes = clientes;
      });//then final

  }//loadClientes final (function)

  getCliente(clientes_id){
    this.database.open();
    return this.database.executeSql('SELECT * FROM clientes WHERE clientes_id = ? ', [clientes_id]).then(
      data => {
        return {
          clientes_id: data.rows.item(0).clientes_id,
          nombre      : data.rows.item(0).nombre
        }//Final Return
    });//Final Then
  }
  getClientes(){
    return this.clientes;
  }
  //***********CLIENTES************** */

  //***********AREAS************** */
  loadAreas(){
    this.database.open();
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
        this.areas = areas;
      })//then final
      .catch(e => {console.log(e)});
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
  getAreas(){
    return this.areas;
  }
  //***********AREAS************** */

  //***********USUARIOS************** */
  loadUsuarios(){
    this.database.open();
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
        this.usuarios = usuarios;
      });//then final

  }//loadUsuarios final (function)

  getUsuario(usuarios_id){
    this.database.open();
    return this.database.executeSql('SELECT * FROM usuarios WHERE usuarios_id = ? ', [usuarios_id]).then(
      data => {
        return {
          usuarios_id : data.rows.item(0).usuarios_id,
          mac         : data.rows.item(0).mac,
          nombre      : data.rows.item(0).nombre
        }//Final Return
    });//Final Then
  }
  getUsuarios(){
    return this.usuarios;
  }
  //***********USUARIOS************** */

  //***********MESAS************** */
  loadMesas(){
    this.database.open();
    var sql_sentence = "SELECT mesas.mesas_id, mesas.capacidad, mesas.estado, usuarios.nombre as usuario, areas.nombre as area, menus.nombre as menu FROM mesas INNER JOIN usuarios ON usuarios.usuarios_id = mesas.usuarios_id INNER JOIN areas    ON areas.areas_id = mesas.areas_id INNER JOIN menus    ON menus.menus_id = mesas.menus_id"
    return this.database.executeSql(sql_sentence, []).then(
      data => {
        let mesas: mesas[] = [];

        if(data.rows.length > 0){
          for(var i = 0; i < data.rows.length; i++){
            mesas.push({
              mesas_id   : data.rows.item(i).mesas_id,
              capacidad  : data.rows.item(i).capacidad,
              estado     : data.rows.item(i).estado,
              usuario    : data.rows.item(i).usuario,
              area       : data.rows.item(i).area,
              menu       : data.rows.item(i).menu
            });//push final
          }//for final
        }//if final
        this.mesas = mesas
      });//then final

  }//loadMesas final (function)

  getMesa(mesas_id){
    this.database.open();
    var sql_sentence = "SELECT mesas.mesas_id, mesas.capacidad, mesas.estado, usuarios.nombre as usuario, areas.nombre as area, menus.nombre as menu FROM mesas INNER JOIN usuarios ON usuarios.usuarios_id = mesas.usuarios_id INNER JOIN areas    ON areas.areas_id = mesas.areas_id INNER JOIN menus    ON menus.menus_id = mesas.menus_id WHERE mesas_id = ?";
    return this.database.executeSql(sql_sentence, [mesas_id]).then(
      data => {
        return {
          mesas_id   : data.rows.item(0).mesas_id,
          capacidad  : data.rows.item(0).capacidad,
          estado     : data.rows.item(0).estado,
          usuario    : data.rows.item(0).usuario,
          area       : data.rows.item(0).area,
          menu       : data.rows.item(0).menu
        }//Final Return
    });//Final Then
  }

  getMesasOfArea(nombre_area){
    var sql_sentence = "SELECT mesas.mesas_id, mesas.capacidad, mesas.estado, usuarios.nombre as usuario, areas.nombre as area, menus.nombre as menu FROM mesas INNER JOIN usuarios ON usuarios.usuarios_id = mesas.usuarios_id INNER JOIN areas ON areas.areas_id = mesas.areas_id INNER JOIN menus    ON menus.menus_id = mesas.menus_id WHERE area = ?"
    return this.database.executeSql(sql_sentence, [nombre_area]).then(
      data => {
        let mesasOfArea: mesas[] = [];
        if(data.rows.length > 0){
          for(var i = 0; i < data.rows.length; i++){
            mesasOfArea.push({
              mesas_id   : data.rows.item(i).mesas_id,
              capacidad  : data.rows.item(i).capacidad,
              estado     : data.rows.item(i).estado,
              usuario    : data.rows.item(i).usuario,
              area       : data.rows.item(i).area,
              menu       : data.rows.item(i).menu
            });//push final
          }//for final
        }
        this.mesasOfArea = mesasOfArea;
      });//Final then
  }

  getMesas(){
    return this.mesas;
  }
  //Mesas of Area. (Varios datos formateados en un arreglo)
  getMesasofAreaBS(){
    return this.mesasOfArea;
  }
  //***********MESAS************** */

  //***********CUENTAS************** */
  loadCuentas(){
    this.database.open();
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
        this.cuentas = cuentas;
      });//then final

  }//loadCuentas final (function)

  getCuenta(cuentas_id){
    this.database.open();
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
  getCuentas(){
    return this.cuentas;
  }
  //Para obtener todas las cuentas de una mesa en especifico.
  getCuentasOfMesa(mesas_id){
    this.database.open();
    let sql_sentence = "SELECT * FROM cuentas WHERE mesas_id=?";
    return this.database.executeSql(sql_sentence,[mesas_id]).then(
      data => {
        let cuentasOfMesa: cuentas[] = [];
        if(data.rows.length > 0){
          for(var i = 0; i < data.rows.length; i++){
            cuentasOfMesa.push({
              cuentas_id   : data.rows.item(i).cuentas_id,
              totalMoneda1 : data.rows.item(i).totalMoneda1,
              totalMoneda2 : data.rows.item(i).totalMoneda2,
              numeroCuenta : data.rows.item(i).numeroCuenta,
              mesas_id     : data.rows.item(i).mesas_id,
              clientes_id  : data.rows.item(i).clientes_id
            });//push final
          }//for final
        this.cuentasOfMesa = cuentasOfMesa
      }
    });
  }
  getCuentasOfMesaBS(){
    return this.cuentasOfMesa;
  }

  /***
   * Productos seleccionados en una cuenta. (NORMAL)
   */
  loadCuentasProductos(cuentas_id){
    let sql_sentence = "SELECT * FROM cuentas_productos WHERE cuentas_id = ?";
    return this.database.executeSql(sql_sentence, [cuentas_id]).then(data => {
      let cuentasProductosRegular :cuentasProductosRegular[] = [];
      if(data.rows.length > 0){
        for(var i = 0; i < data.rows.length; i++){
          cuentasProductosRegular.push({
            cuentas_productos_id: data.rows.item(i).cuentas_productos_id,
            cuentas_id          : data.rows.item(i).cuentas_id,
            productos_id        : data.rows.item(i).productos_id,
            cantidad            : data.rows.item(i).cantidad
          })//Final Push
        }//Final for
      }//Final if
     this.cuentasProductosRegular = cuentasProductosRegular;
    });//Final data

  }
  getCuentasProductosRegularBS(){
    return this.cuentasProductosRegular;
  }
  //***********INSERT************** */
  insertCuentasProductos(cuentas_id, productos_id, cantidad){
    let sql_sentence = "INSERT INTO cuentas_productos(cuentas_id, productos_id, cantidad) VALUES (?,?,?);";
    return this.database.executeSql(sql_sentence,[cuentas_id, productos_id, cantidad]).then(data => {
      console.log("Fueron ingresados los datos al carrito. cuentas_id:"+cuentas_id+" productos_id:"+productos_id+" cantidad:"+cantidad);
    });
  }
  //***********DELETE************** */
  deleteCuentasProductos(cuentas_id){
    let sql_sentence = "DELETE FROM cuentas_productos WHERE cuentas_id=?";
    return this.database.executeSql(sql_sentence,[cuentas_id]).then(data => {
      console.log("Se borro todo!");
    });
  }
  /***
   * Productos seleccionados en una cuenta. (FORMATEADO)
   */
  getCuentasProductos(cuentas_id){
    let sql_sentence = "SELECT cuentas_productos.cuentas_id, productos.productos_id as producto_id, productos.nombre as producto_nombre, productos.precio as producto_precio, cuentas_productos.cantidad FROM cuentas_productos JOIN productos ON productos.productos_id = cuentas_productos.productos_id WHERE cuentas_productos.cuentas_id=?";
    return this.database.executeSql(sql_sentence,[cuentas_id]).then(
      data=>{
        let cuentas_productos:cuentasProductos[] = [];
        if(data.rows.length > 0){
          for(var i =0; i< data.rows.length; i++){
            cuentas_productos.push({
              cuentas_id     : data.rows.item(i).cuentas_id,
              producto_id    : data.rows.item(i).producto_id,
              producto_nombre: data.rows.item(i).producto_nombre,
              producto_precio: data.rows.item(i).producto_precio,
              cantidad       : data.rows.item(i).cantidad
            });//push final
          }//for Final
        }//if Final
        this.cuentasProductos = cuentas_productos;
      });//then final
  }


  getCuentasProductosBS(){
    return this.cuentasProductos;
  }
  //***********CUENTAS************** */
}