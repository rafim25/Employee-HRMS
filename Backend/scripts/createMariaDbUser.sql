-- Run once on the AWS MariaDB host (edit the password before running):
--   sudo mysql < scripts/createMariaDbUser.sql
--
-- Creates the app database + a localhost-only user for the Node API.
-- MariaDB root on Ubuntu often uses unix_socket auth, so the app should
-- NOT connect as root — use the hrms user below instead.

CREATE DATABASE IF NOT EXISTS `db_penggajian3`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'hrms'@'localhost' IDENTIFIED BY 'admin@123';

GRANT ALL PRIVILEGES ON `db_penggajian3`.* TO 'hrms'@'localhost';
FLUSH PRIVILEGES;
