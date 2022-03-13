/*

Pour logs un évènement, placer la méthode suivante: logger.eventLogger.log(NIVEAU,VOTRE MESSAGE)
- Deux niveaux possible: -> 'info' 
                         ->'error'

EXEMPLE pour logs des infos sur la co à la BDD : logger.eventLogger.log('info', 'Connecté à la base de données MySQL!') 

*/


const winston = require('winston')

const myformat = winston.format.combine(winston.format.timestamp(), winston.format.align(),winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`));

//--------------------------------logging function-----------------------//

const eventLogger = winston.createLogger({
    level:'info',
    transports:[
        new winston.transports.File({
            
            filename:'log/info.log',
            level:'info',
            format: myformat

        }),

        new winston.transports.File({

            filename:'log/error.log',
            level:'error',
            format: myformat

        }),

        new winston.transports.File({

            filename:'log/combined.log',
            format: myformat

        })
    ]
})

if(process.env.NODE_ENV !=='production'){
    eventLogger.add(new winston.transports.Console({
        format: myformat
    }))
}

module.exports = { eventLogger }