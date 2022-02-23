const readFromExchange = require("../read-from-exchange");
const elasticClient = require("../../loader/elastic-loader");
const { ElasticService } = require("../index");

const elasticService = new ElasticService(elasticClient);
/**
 * @description Ingest Data into Elasticsearch
 * @param {String} type
 * @param {String} index
 * @param {Object} data
 */
const ingestData = async (message) => {
    try {
        let result;
        const { index, type, id, body, format } = JSON.parse(
            await message.content.toString()
        );

        //Format can be bulk , update , delete
        if (format) {
            console.log(body);
            //Send A bulk request using the bulk API to the db
            // Use Bulk or loop ?
            // result = await elasticClient.bulk({
            //     index : index ,
            //     type : type  ,
            //     body : body
            // })
            // console.log(result)
        } else {
            await elasticService.index(index, type, id, body);
        }
        return result;
    } catch (error) {
        console.error(error);
    }
};

const readBulkData = async (message) => {};

readFromExchange("es", "fanout", "esKey", ingestData);
