import { type ClientSchema, a, defineData, defineFunction } from "@aws-amplify/backend";

/*=================================================================
   Define our custom handlers
==================================================================*/

const echoHandler = defineFunction({
  entry: './echo-handler/handler.ts'
})

/*=================================================================
   Define our db schema and queries, mutations, and subscriptions
==================================================================*/
const schema = a.schema({

  Member: a.model({
    name: a.string().required(),
    profileImagePath: a.string(),
    // 1. Create a reference field
    // groupId: a.id(),
    // 2. Create a belongsTo relationship with the reference field
    //group: a.belongsTo('Group', 'groupId'),
    groups: a.hasMany('GroupMember', 'memberId'),
    posts: a.hasMany('Post', 'authorId'),
  })
  .authorization((allow) => [allow.owner()]),
  //.authorization((allow) => [allow.publicApiKey()]),

  Group: a.model({
    name: a.string().required(),

    // 3. Create a hasMany relationship with the reference field
    //    from the `Member`s model.
    // members: a.hasMany('Member', 'groupId'),
    members: a.hasMany('GroupMember', 'groupId'),
    //posts: a.hasMany('Post', 'id'),
  })
  .authorization((allow) => [allow.owner()]),

  GroupMember: a.model({
    // 1. Create reference fields to both ends of
    //    the many-to-many relationship
    memberId: a.id().required(),
    groupId: a.id().required(),

    member: a.belongsTo('Member', 'memberId'),
    group: a.belongsTo('Group', 'groupId'),
  })
  .authorization((allow) => [allow.owner()]),

  Post: a.model({
    title: a.string().required(),
    content: a.string().required(),
    // Reference fields must correspond to identifier fields.
    authorId: a.id().required(),
    // Must pass references in the same order as identifiers.
    author: a.belongsTo('Member', 'authorId'),
    privacySetting: a.enum(['PRIVATE', 'GROUP', 'PUBLIC']),
  })
  //.sortKeys(["createdAt"]),
  .authorization((allow) => [allow.owner()]),
  // allow anyone who's logged in to perform any operation
  //.authorization((allow) => [allow.authenticated()]),
  // below, any user (using Amazon Cognito identity pool's unauthenticated roles) 
  // is allowed to read all posts, but only owners can create, update, and delete their own posts.
  //.authorization(allow => [
  //  allow.guest().to(["read"]),
  //  allow.owner()
  //])

  // Authorization below is set up for a dynamic set of users to have access
  // In the example below, the members list is populated with the creator 
  // of the record upon record creation. The creator can then update the 
  // members field with additional users. Any user listed in the members
  // field can access the record.
//  GroupPost: a.model({
//    title: a.string().required(),
//    content: a.string().required(),
    // Reference fields must correspond to identifier fields.
//    authorId: a.id().required(),
    // Must pass references in the same order as identifiers.
//    author: a.belongsTo('Member', 'authorId'),
//    members: a.string().array(),
//    group: a.belongsTo('Group', 'groupId'),
//    privacySetting: a.enum(['PRIVATE', 'GROUP', 'PUBLIC']),
//  })
 // .authorization(allow => [allow.ownersDefinedIn('members')]),
  
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

  EchoResponse: a
    .customType({
      content: a.string(),
      executionDuration: a.float()
    }),

  Photo: a
    .customType({
      createdDate: a.datetime().required(),
      imagePath: a.string().required(),
      memberId: a.string(),
      description: a.string(),
      tags: a.string().array(),
    }),

  Song: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      coverArtPath: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),

  PhotoAlbum: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      albumPhoto: a.ref('Photo'),
      photos: a.ref('Photo').array(),
    })
    .authorization((allow) => [allow.authenticated()]),

  echo: a
    .query()
    .arguments({ content: a.string() })
    .returns(a.ref('EchoResponse'))
    //.authorization(allow => [allow.publicApiKey()])
    .authorization((allow) => [allow.authenticated()])
    // 3. set the function has the handler
    .handler(a.handler.function(echoHandler))
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
