const amqp = require("amqplib/callback_api");
amqp.connect("amqp://localhost", (connectError, connection) => {
    if (connectError) throw connectError;
    connection.createChannel((channelError, channel) => {
        if (channelError) throw channelError;

        let exchange = "topic_logs";
        let args = process.argv.slice(2);
        let message = args.slice(1).join(" ") || "Hello World!";
        let key = args.length > 1 ? args[0] : "anonymous.info";

        channel.assertExchange(exchange, "topic", {
            durable: false,
        });

        channel.publish(exchange, key, Buffer.from(message));
        console.log("Message sent");
    });
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});
