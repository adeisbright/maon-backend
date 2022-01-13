const amqp = require("amqplib/callback_api");
amqp.connect("amqp://localhost", (connectError, connection) => {
    if (connectError) throw connectError;
    connection.createChannel((channelError, channel) => {
        if (channelError) throw channelError;

        let exchange = "logger";
        let message = process.argv.slice(2).join(" ") || "Hello World!";

        channel.assertExchange(exchange, "fanout", {
            durable: false,
        });

        channel.publish(exchange, "", Buffer.from(message));
        console.log("Message sent");
    });
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});
