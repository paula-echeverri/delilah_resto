CREATE DATABASE IF NOT EXISTS `delihahResto` ;
USE `delihahResto` ;

-- -----------------------------------------------------
-- Tabla `delihahResto`.`productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `delihahResto`.`productos` (
  `id_plato` INT NOT NULL AUTO_INCREMENT,
  `nombre_producto` VARCHAR(100) NOT NULL,
  `precio` INT NOT NULL,
  PRIMARY KEY (`id_plato`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `delihahResto`.`Usurario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `delihahResto`.`Usurario` (
  `idUsurario` INT NOT NULL AUTO_INCREMENT,
  `nombre_apellido` VARCHAR(100) NOT NULL,
  `correo` VARCHAR(90)  NOT NULL,
  `telefono` INT NOT NULL,
  `direccion` VARCHAR(90) NOT NULL,
  `usuario` VARCHAR(90) NOT NULL,
  `contrasena` VARCHAR(90) NOT NULL,
  `admon` TINYINT NOT NULL,
  PRIMARY KEY (`idUsurario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `delihahResto`.`pedidos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `delihahResto`.`pedidos` (
  `idpedido` INT NOT NULL  PRIMARY KEY AUTO_INCREMENT,
  `estado` ENUM('nuevo', 'confirnado', 'preparando', 'enviando', 'cancelado', 'entregado') NOT NULL,
  `metodo_pago` ENUM('efectivo', 'credito') NOT NULL,
  `hora` TIME NOT NULL,
  `idUsurario` INT NOT NULL,
    FOREIGN KEY (`idUsurario`)
    REFERENCES `delihahResto`.`Usurario` (`idUsurario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Tabla `delihahResto`.`detalle_pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `delihahResto`.`detalle_pedido` (
  `iddetalle_pedido` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `id_plato` INT NOT NULL,
  `idpedido` INT NOT NULL,
    FOREIGN KEY (`id_plato`)
    REFERENCES `delihahResto`.`productos` (`id_plato`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    FOREIGN KEY (`idpedido`)
    REFERENCES `delihahResto`.`pedidos` (`idpedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;