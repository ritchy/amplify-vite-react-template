import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({

  Member: a.model({
    name: a.string().required(),
    // 1. Create a reference field
    // groupId: a.id(),
    // 2. Create a belongsTo relationship with the reference field
    //group: a.belongsTo('Group', 'groupId'),
    groups: a.hasMany('GroupMember', 'memberId'),
    posts: a.hasMany('Post', 'authorId'),
  })
  .authorization((allow) => [allow.publicApiKey()]),

  Group: a.model({
    name: a.string().required(),

    // 3. Create a hasMany relationship with the reference field
    //    from the `Member`s model.
    // members: a.hasMany('Member', 'groupId'),
    members: a.hasMany('GroupMember', 'groupId'),
  })
  .authorization((allow) => [allow.publicApiKey()]),

  GroupMember: a.model({
    // 1. Create reference fields to both ends of
    //    the many-to-many relationship
    memberId: a.id().required(),
    groupId: a.id().required(),

    member: a.belongsTo('Member', 'memberId'),
    group: a.belongsTo('Group', 'groupId'),
  })
  .authorization((allow) => [allow.publicApiKey()]),

  Post: a.model({
    title: a.string().required(),
    content: a.string().required(),
    // Reference fields must correspond to identifier fields.
    authorId: a.id().required(),
    // Must pass references in the same order as identifiers.
    author: a.belongsTo('Member', 'authorId'),
    privacySetting: a.enum(['PRIVATE', 'GROUP', 'PUBLIC']),
  })
  .authorization((allow) => [allow.owner()]),
  //.authorization((allow) => [allow.publicApiKey()]),

  SurveyResponse: a.customType({
        choiceId: a.string().required(),
        memberId: a.string().required(),
  }),

  SurveyQuestion: a.customType({
        questionId: a.string().required(),
        text: a.string().required(),
  }),

  Survey: a
    .model({
      title: a.string().required(),
      createdDate: a.datetime().required(),
      multipleAnswers: a.boolean().required(),
      maxAnswers: a.integer(),
      questions: a.ref('SurveyQuestion').array().required(),
      responses: a.ref('SurveyResponse').array(),
      privacySetting: a.enum(['PRIVATE', 'FRIENDS_ONLY', 'PUBLIC']),
    })
    //.authorization((allow) => [allow.publicApiKey()]),
    .authorization((allow) => [allow.owner()]),

  Todo: a
    .model({
      content: a.string(),
      notes: a.string().array(),
      isDone: a.boolean(),
    })
    //.authorization((allow) => [allow.publicApiKey()]),
    .authorization((allow) => [allow.owner()]),
});

// The allow.publicApiKey() rule designates that anyone authenticated using an API 
// key can create, read, update, and delete todos.

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
