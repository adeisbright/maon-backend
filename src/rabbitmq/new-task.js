const amqp = require("amqplib/callback_api");
const message = process.argv.slice(2).join(" ") || "Hello , World";
amqp.connect("amqp://localhost", function (connectError, connection) {
    if (connectError) throw connectError;
    connection.createChannel((channelError, channel) => {
        if (channelError) throw channelError;
        let queue = "task_queue";

        channel.assertQueue(queue, {
            durable: true,
        });
        channel.sendToQueue(queue, Buffer.from(message), {
            persistent: true,
        });
        console.log(message);
    });
    setTimeout(() => {
        connection.close();
        process.exit(1);
    }, 500);
});
