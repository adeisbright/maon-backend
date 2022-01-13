const amqp = require("amqplib/callback_api");
amqp.connect("amqp://localhost", function (connectError, connection) {
    if (connectError) throw connectError;
    connection.createChannel((channelError, channel) => {
        if (channelError) throw channelError;
        let queue = "test";
        channel.assertQueue(queue, {
            durable: false,
        });
        channel.consume(
            queue,
            (message) => {
                console.log(message.content.toString());
            },
            {
                noAck: false,
            }
        );
    });
});
