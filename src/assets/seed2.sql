/**********MENUS**********/
INSERT INTO menus (nombre) VALUES ('Almuerzos');
INSERT INTO menus (nombre) VALUES ('Pizzas');
INSERT INTO menus (nombre) VALUES ('Postres');
/**********MENUS**********/

/**********PRODUCTOS**********/
INSERT INTO productos (nombre, estado, precio) VALUES ('Hamburguesa', 0, 230000.00);
INSERT INTO productos (nombre, estado, precio) VALUES ("Pizza", 0, 350000.00);
INSERT INTO productos (nombre, estado, precio) VALUES ("Pasta Carbonara", 0, 200000.00);
INSERT INTO productos (nombre, estado, precio) VALUES ("Torta de Chocolate", 0, 1000000.00);
/**********PRODUCTOS**********/

/**********PRODUCTOS_MENUS**********/
INSERT INTO productos_menus (menus_id, productos_id) values (1, 1);
INSERT INTO productos_menus (menus_id, productos_id) values (1, 2);
INSERT INTO productos_menus (menus_id, productos_id) values (1, 3);
INSERT INTO productos_menus (menus_id, productos_id) values (1, 4);
/**********PRODUCTOS_MENUS**********/

/**********CLIENTES**********/
INSERT INTO clientes (nombre) VALUES ('Default Client');
/**********CLIENTES**********/

/**********AREAS**********/
INSERT INTO areas (nombre) VALUES("Salon");
INSERT INTO areas (nombre) VALUES("Terraza");
/**********AREAS**********/

/**********USUARIOS**********/
INSERT INTO usuarios (nombre) VALUES ('Mesero01');
/**********USUARIOS**********/

/**********MESAS**********/
INSERT INTO mesas(capacidad, estado, usuarios_id, areas_id, menus_id) VALUES (4, 1, 1, 1, 1); 
/**********MESAS**********/

/**********CUENTAS**********/
INSERT INTO cuentas(totalMoneda1, totalMoneda2, numeroCuenta, mesas_id, clientes_id) VALUES (0.0, 0.0, 'CTA#001', 1, 1);
/**********CUENTAS**********/

/*************UPDATE DE FLAG**************/
UPDATE flags SET estado = "true" WHERE flags_id = 1;
/*************UPDATE DE FLAG**************/