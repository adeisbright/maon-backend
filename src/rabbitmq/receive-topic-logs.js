const amqp = require("amqplib/callback_api");

let args = process.argv.slice(2);
if (args.length === 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(0);
}

amqp.connect("amqp://localhost", (connectError, connection) => {
    if (connectError) throw connectError;
    connection.createChannel((channelError, channel) => {
        if (channelError) throw channelError;

        let exchange = "topic_logs";

        channel.assertExchange(exchange, "topic", {
            durable: false,
        });

        channel.assertQueue(
            "",
            {
                exclusive: true,
            },
            (queueError, q) => {
                if (queueError) throw queueError;

                console.log("Waiting for message in ", q.queue);
                args.map((key) => channel.bindQueue(q.queue, exchange, key));

                channel.consume(
                    q.queue,
                    (msg) => {
                        if (msg.content) {
                            console.log(
                                " [x] %s: '%s'",
                                msg.fields.routingKey,
                                msg.content.toString()
                            );
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
