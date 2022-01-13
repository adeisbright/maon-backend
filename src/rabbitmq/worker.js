const amqp = require("amqplib/callback_api");
amqp.connect("amqp://localhost", function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        const queue = "task_queue";

        channel.assertQueue(queue, {
            durable: true,
        });

        channel.consume(
            queue,
            (message) => {
                let secs = message.content.toString().split(".").length;
                console.log(secs);
                console.log(" [x] Received %s.", message.content.toString());
                setTimeout(() => {
                    console.log(" [x] Done Processing");
                }, secs * 1000);
            },
            {
                noAck: true,
            }
        );
    });
});
