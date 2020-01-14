CREATE TABLE IF NOT EXISTS flags(flags_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, descripcion VARCHAR2 NOT NULL, estado BOOLEAN NOT NULL);
INSERT INTO flags(descripcion, estado) VALUES("Configurado",false);
/**********MENUS**********/
CREATE TABLE IF NOT EXISTS menus (menus_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,nombre VARCHAR2 NOT NULL,descripcion VARCHAR2);
/**********MENUS**********/

/**********PRODUCTOS**********/
CREATE TABLE IF NOT EXISTS productos (productos_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nombre VARCHAR2 NOT NULL, estado NUMBER NOT NULL,precio NUMBER NOT NULL,imagen VARCHAR2);
/**********PRODUCTOS**********/

/**********PRODUCTOS_MENUS**********/
CREATE TABLE IF NOT EXISTS productos_menus (productos_menus_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,menus_id INTEGER NOT NULL,productos_id INTEGER NOT NULL,FOREIGN KEY (menus_id) REFERENCES menus(menus_id),FOREIGN KEY (productos_id) REFERENCES productos(productos_id));
/**********PRODUCTOS_MENU**********/

/**********CLIENTES**********/
CREATE TABLE IF NOT EXISTS clientes (clientes_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,nombre VARCHAR2);
/**********CLIENTES**********/

/**********AREAS**********/
CREATE TABLE IF NOT EXISTS areas (areas_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,nombre VARCHAR2 NOT NULL,imagen VARCHAR2);
/**********AREAS**********/

/**********USUARIOS**********/
CREATE TABLE IF NOT EXISTS usuarios (usuarios_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,mac VARCHAR2,nombre VARCHAR2 NOT NULL);
INSERT INTO usuarios (nombre) VALUES ('Mesero01');
/**********USUARIOS**********/

/**********MESAS**********/
CREATE TABLE IF NOT EXISTS mesas (mesas_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,capacidad INTEGER,estado INTEGER,usuarios_id INTEGER NOT NULL,areas_id INTEGER NOT NULL,menus_id INTEGER NOT NULL,FOREIGN KEY (usuarios_id) REFERENCES usuarios(usuarios_id),FOREIGN KEY (areas_id) REFERENCES areas(areas_id),FOREIGN KEY (menus_id) REFERENCES menus(menus_id));
/**********MESAS**********/

/**********CUENTAS**********/
CREATE TABLE IF NOT EXISTS cuentas (cuentas_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,totalMoneda1 FLOAT,totalMoneda2 FLOAT,numeroCuenta VARCHAR2,mesas_id INTEGER NOT NULL,clientes_id INTEGER NOT NULL,FOREIGN KEY (mesas_id) REFERENCES mesas(mesas_id),FOREIGN KEY (clientes_id) REFERENCES clientes(clientes_id));
/**********CUENTAS**********/

/*CUENTAS_PRODUCTOS*/
CREATE TABLE IF NOT EXISTS cuentas_productos(cuentas_productos_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,cuentas_id INTEGER,productos_id INTEGER,cantidad INTEGER);
/*CUENTAS_PRODUCTOS*/