import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema }  from "../resource.js";
import { generateClient } from "aws-amplify/data";


const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const room = await client.models.Room.create({
    topic: "room ${date.now()}",
    members: []
    //  topic: event.request.userAttributes.email
      //profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
  });
  return room;
};