CREATE DATABASE IF NOT EXISTS `POLYCHAT` DEFAULT CHARACTER SET UTF8MB4 COLLATE utf8_general_ci;
USE `POLYCHAT`;

CREATE TABLE `CHANNEL` (
  `id_channel` int not null auto_increment,
  `name_channel` VARCHAR(100),
  PRIMARY KEY (`id_channel`)
) ;

CREATE TABLE `IS_IN_CHANNEL` (
  `nickname_user` VARCHAR(42),
  `id_channel` int,
  `is_admin` bool,
  PRIMARY KEY (`nickname_user`, `id_channel`)
);

CREATE TABLE `MESSAGE` (
  `id_message` int not null auto_increment,
  `time_message` datetime,
  `id_channel` int,
  `nickname_user` VARCHAR(42),
  PRIMARY KEY (`id_message`)
);

CREATE TABLE `USER` (
  `nickname_user` VARCHAR(42),
  `password_user` VARCHAR(250),
  PRIMARY KEY (`nickname_user`)
);

ALTER TABLE `IS_IN_CHANNEL` ADD FOREIGN KEY (`id_channel`) REFERENCES `CHANNEL` (`id_channel`);
ALTER TABLE `IS_IN_CHANNEL` ADD FOREIGN KEY (`nickname_user`) REFERENCES `USER` (`nickname_user`);
ALTER TABLE `MESSAGE` ADD FOREIGN KEY (`nickname_user`) REFERENCES `USER` (`nickname_user`);
ALTER TABLE `MESSAGE` ADD FOREIGN KEY (`id_channel`) REFERENCES `CHANNEL` (`id_channel`);