CREATE TABLE IF NOT EXISTS flags(flags_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, descripcion VARCHAR2 NOT NULL, estado BOOLEAN NOT NULL);
INSERT INTO flags(descripcion, estado) VALUES("Configurado",false);
/**********MENUS**********/
CREATE TABLE IF NOT EXISTS menus (menus_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,nombre VARCHAR2 NOT NULL,descripcion VARCHAR2);
INSERT INTO menus (nombre) VALUES ('Almuerzos');
INSERT INTO menus (nombre) VALUES ('Pizzas');
INSERT INTO menus (nombre) VALUES ('Postres');
/**********MENUS**********/

/**********PRODUCTOS**********/
CREATE TABLE IF NOT EXISTS productos (productos_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, nombre VARCHAR2 NOT NULL, estado NUMBER NOT NULL,precio NUMBER NOT NULL,imagen VARCHAR2);

INSERT INTO productos (nombre, estado, precio) VALUES ('Hamburguesa', 0, 230000.00);
INSERT INTO productos (nombre, estado, precio) VALUES ("Pizza", 0, 350000.00);
INSERT INTO productos (nombre, estado, precio) VALUES ("Pasta Carbonara", 0, 200000.00);
INSERT INTO productos (nombre, estado, precio) VALUES ("Torta de Chocolate", 0, 1000000.00);
/**********PRODUCTOS**********/

/**********PRODUCTOS_MENUS**********/
CREATE TABLE IF NOT EXISTS productos_menus (productos_menus_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,menus_id INTEGER NOT NULL,productos_id INTEGER NOT NULL,FOREIGN KEY (menus_id) REFERENCES menus(menus_id),FOREIGN KEY (productos_id) REFERENCES productos(productos_id));
INSERT INTO productos_menus (menus_id, productos_id) values (1, 1);
INSERT INTO productos_menus (menus_id, productos_id) values (1, 2);
INSERT INTO productos_menus (menus_id, productos_id) values (1, 3);
INSERT INTO productos_menus (menus_id, productos_id) values (1, 4);
/**********PRODUCTOS_MENU**********/

/**********CLIENTES**********/

CREATE TABLE IF NOT EXISTS clientes (clientes_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,nombre VARCHAR2);
INSERT INTO clientes (nombre) VALUES ('Default Client');
/**********CLIENTES**********/

/**********AREAS**********/
CREATE TABLE IF NOT EXISTS areas (areas_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,nombre VARCHAR2 NOT NULL,imagen VARCHAR2);
INSERT INTO areas (nombre) VALUES("Salon");
INSERT INTO areas (nombre) VALUES("Terraza");
/**********AREAS**********/

/**********USUARIOS**********/
CREATE TABLE IF NOT EXISTS usuarios (usuarios_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,mac VARCHAR2,nombre VARCHAR2 NOT NULL);
INSERT INTO usuarios (nombre) VALUES ('Mesero01');
/**********USUARIOS**********/

/**********MESAS**********/
CREATE TABLE IF NOT EXISTS mesas (mesas_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,capacidad INTEGER,estado INTEGER,usuarios_id INTEGER NOT NULL,areas_id INTEGER NOT NULL,menus_id INTEGER NOT NULL,FOREIGN KEY (usuarios_id) REFERENCES usuarios(usuarios_id),FOREIGN KEY (areas_id) REFERENCES areas(areas_id),FOREIGN KEY (menus_id) REFERENCES menus(menus_id));
INSERT INTO mesas(capacidad, estado, usuarios_id, areas_id, menus_id) VALUES (4, 1, 1, 1, 1); 
/**********MESAS**********/

/**********CUENTAS**********/
CREATE TABLE IF NOT EXISTS cuentas (cuentas_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,totalMoneda1 FLOAT,totalMoneda2 FLOAT,numeroCuenta VARCHAR2,mesas_id INTEGER NOT NULL,clientes_id INTEGER NOT NULL,FOREIGN KEY (mesas_id) REFERENCES mesas(mesas_id),FOREIGN KEY (clientes_id) REFERENCES clientes(clientes_id));
INSERT INTO cuentas(totalMoneda1, totalMoneda2, numeroCuenta, mesas_id, clientes_id) VALUES (0.0, 0.0, 'CTA#001', 1, 1);
/**********CUENTAS**********/