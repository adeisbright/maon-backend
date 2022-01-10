const amqp = require("amqplib/callback_api");
amqp.connect("amqp://localhost", function (connectError, connection) {
    if (connectError) throw connectError;
    connection.createChannel((channelError, channel) => {
        if (channelError) throw channelError;
        let queue = "test";
        let message = "We should be in charge of the city";
        channel.assertQueue(queue, {
            durable: false,
        });
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(23);
    });
    setTimeout(() => {
        connection.close();
        process.exit(1);
    }, 500);
});
