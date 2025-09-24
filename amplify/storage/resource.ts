import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "trip-images",
  access: (allow) => ({
    "images/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
