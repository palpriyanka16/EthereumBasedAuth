'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    hashedPassword: {
      type: DataTypes.STRING,
    },
    pubAddr: {
      type: DataTypes.STRING,
      unique: true,
    },
    nonce: {
      type: DataTypes.STRING,
    }
  }, {
    freezeTableName: true,
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
