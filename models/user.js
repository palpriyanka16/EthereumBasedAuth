'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    pubAddr: {
    	allowNull: false,
    	type: DataTypes.STRING,
    	unique: true
    },
    nonce: {
    	allowNull: false,
    	type: DataTypes.INTEGER,
    	defaultValue: () => Math.floor(Math.random() * 1000000)
    }
  }, {
  	freezeTableName: true
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};