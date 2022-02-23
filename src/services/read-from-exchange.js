const amqplib = require("amqplib");

/**
 * @description
 * read messages from an exchange in a message broker
 * @param {String} exchange the exchange name
 * @param {String} type the type of exchange
 * @param {Boolean} isDurable the durability of the exchange
 * @param {Function} cb the callback to run assuming the message was read from the queue
 * @returns Boolean
 * @example
 * readFromExchange(example , foo , readMessage)
 */
const readFromExchange = async (exchange, type, key, cb, isDurable = false) => {
    const connect = await amqplib.connect(process.env.AMQP_URL);
    try {
        const channel = await connect.createChannel();
        channel.assertExchange(exchange, type, { durable: isDurable });
        const queue = await channel.assertQueue("", {
            durable: isDurable,
        });
        await channel.bindQueue(queue.queue, exchange, key);
        console.log("About To Consume");
        await channel.consume(queue.queue, (e) => cb(e), { noAck: true });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

module.exports = readFromExchange;
