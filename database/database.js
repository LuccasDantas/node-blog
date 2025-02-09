const Sequelize = require('sequelize')
const { logger } = require('sequelize/lib/utils/logger')

const connection = new Sequelize('guiapress', 'root', '012345678', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: "-03:00"
})

module.exports = connection