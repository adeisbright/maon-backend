const amqplib = require("amqplib");

/**
 * @description sends a message to RabbitMQ
 * @param {String} queue a queue to connect to or create if it does not exist
 * @param {Any} message to send to a queue. It can be any type
 */
const sendMessageToQueue = async (queue, message) => {
    const connect = await amqplib.connect(process.env.AMQP_URL);
    try {
        const msgTypes = ["number", "string", "boolean"];
        const channel = await connect.createChannel();
        await channel.assertQueue(queue, {
            durable: false,
        });
        const msg = msgTypes.includes(message)
            ? message
            : JSON.stringify(message);
        channel.sendToQueue(queue, Buffer.from(msg));
        console.log("Message sent");
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

module.exports = sendMessageToQueue;
