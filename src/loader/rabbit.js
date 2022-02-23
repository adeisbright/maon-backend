const amqplib = require("amqplib");

/**
 *
 * @param {String} exchange name of the exchange
 * @param {String} type type of exchange
 * @param {String} key the key to use for the binding
 * @param {Any} message the message to send.
 * @returns
 */

const exchangeMessage = async (
    message,
    exchange = "exchange1",
    type = "direct",
    key = "anonymous.start"
) => {
    const connect = await amqplib.connect(process.env.AMQP_URL);
    try {
        const channel = await connect.createChannel();
        const exchangeTypes = ["direct", "topic", "fanout", "headers"];
        const msgTypes = ["number", "string", "boolean"];

        if (!exchangeTypes.includes(type)) {
            throw new Error("Unsupported type provided");
        }

        await channel.assertExchange(exchange, type, {
            durable: false,
        });

        const msg = msgTypes.includes(message)
            ? message
            : JSON.stringify(message);

        channel.publish(exchange, key, Buffer.from(msg));
        return {
            worked: true,
        };
    } catch (error) {
        console.error(error);
        return {
            worked: false,
        };
    } finally {
        await connect.close();
    }
};

module.exports = exchangeMessage;
