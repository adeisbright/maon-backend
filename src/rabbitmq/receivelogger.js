const amqp = require("amqplib/callback_api");
amqp.connect("amqp://localhost", (connectError, connection) => {
    if (connectError) throw connectError;
    connection.createChannel((channelError, channel) => {
        if (channelError) throw channelError;

        let exchange = "logger";

        channel.assertExchange(exchange, "fanout", {
            durable: false,
        });

        channel.assertQueue(
            "",
            {
                exclusive: true,
            },
            (queueError, q) => {
                if (queueError) throw queueError;
                channel.bindQueue(q.queue, exchange, "");
                console.log("Waiting for message in ", q.queue);

                channel.consume(
                    q.queue,
                    (msg) => {
                        if (msg.content) {
                            console.log(msg.content.toString());
                        }
                    },
                    {
                        noAck: false,
                    }
                );
            }
        );
    });
});
