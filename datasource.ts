const { DataSource } = require("typeorm");
import { DbConfig } from './datasource-options';

const connectionSource = new DataSource(DbConfig);

module.exports = {
  connectionSource,
}
