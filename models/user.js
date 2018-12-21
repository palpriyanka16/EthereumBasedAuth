'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
    },
    pubAddr: {
    	allowNull: false,
    	type: DataTypes.STRING,
    	unique: true
    },
    nonce: {
    	allowNull: false,
    	type: DataTypes.STRING
    }
  }, {
  	freezeTableName: true
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
