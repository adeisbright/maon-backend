const amqp = require("amqplib/callback_api");
amqp.connect("amqp://localhost", (connectError, connection) => {
    if (connectError) throw connectError;
    connection.createChannel((channelError, channel) => {
        if (channelError) throw channelError;

        let exchange = "direct_logs";
        let args = process.argv.slice(2);
        let message = args.slice(1).join(" ") || "Hello World!";
        let severity = args.length > 1 ? args[0] : "info";

        channel.assertExchange(exchange, "direct", {
            durable: false,
        });

        channel.publish(exchange, severity, Buffer.from(message));
        console.log("Message sent");
    });
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});
