import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName2,
    Item: {
      // The attributes of the item to be created
      userId: event.requestContext.identity.cognitoIdentityId, // The id of the user
      symptomId: uuid.v1(), // A unique uuid
      symptomName: data.symptomName, // Parsed from request body
      symptomArea: data.symptomArea, // Parsed from request body
      painLevel: data.painLevel, // Parsed from request body
      description: data.description, // Parsed from request body
      attachment: data.attachment, // Parsed from request body
      symptomDate: data.symptomDate, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return params.Item;
});