const amqplib = require("amqplib");

// const connect = async (url) => {
//     try {
//         const result = await amqplib.connect(url);
//         return result;
//     } catch (error) {
//         return error;
//     }
// };
// connect("amqp://localhost");
// const createChannel = async (queue, msg) => {
//     try {
//         const channel = await connect.createChannel();
//         await channel.assertQueue(queue, {
//             durable: false,
//         });
//         await channel.sendToQueue(queue, Buffer.from(message));
//         console.log(" [x] Sent %s", msg);
//         setTimeout(() => {
//             connection.close();
//             process.exit(0);
//         }, 500);
//     } catch (error) {
//         console.log(error);
//         return error;
//     }
// };

// createChannel("another", "This is another");

const sendMessageToQueue = async (queue, message) => {
    const connect = await amqplib.connect(process.env.AMQP_URL);
    try {
        const channel = await connect.createChannel();
        await channel.assertQueue(queue, { durable: false });
        // Once the message has been sent ,
        // How do I consume it via a service
        // How do I also return a response to the user that created the request
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`The Message is gone ${message}`);
        //Is there any need to close the connection
    } catch (error) {
        console.log(error);
        return error;
    } finally {
        setTimeout(async () => {
            await connect.close();
        }, 500);
    }
};

sendMessageToQueue("fake", "Champions League will soon start");
