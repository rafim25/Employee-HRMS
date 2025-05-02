import { DataTypes } from 'sequelize';
import sequelize from '../config/Database.js';

const RoomPricing = sequelize.define('RoomPricing', {
  pricing_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true
  },
  room_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'hotel_rooms',
      key: 'room_id'
    }
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0
  },
  coupon_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  final_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  tableName: 'roompricing',
  hooks: {
    beforeValidate: (roomPricing) => {
      if (roomPricing.base_price && roomPricing.discount) {
        const discountAmount = (roomPricing.base_price * roomPricing.discount) / 100;
        roomPricing.final_price = roomPricing.base_price - discountAmount;
      } else if (roomPricing.base_price) {
        roomPricing.final_price = roomPricing.base_price;
      }
    }
  }
});

export default RoomPricing; 