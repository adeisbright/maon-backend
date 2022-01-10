const amqp = require("amqplib/callback_api");
amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        const queue = "Hello";
        const message =
            "Adeleke is ruling this place and nothing will stop him from bringing glories";

        channel.assertQueue(queue, {
            durable: false,
        });
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(" [x] Sent %s", message);
    });
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});
