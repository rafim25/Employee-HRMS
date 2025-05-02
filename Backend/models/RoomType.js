import { DataTypes } from 'sequelize';
import db from '../config/Database.js';

const RoomType = db.define('RoomType', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  base_price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  max_capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bed_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  room_size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  }
}, {
  freezeTableName: true
});

export default RoomType; 