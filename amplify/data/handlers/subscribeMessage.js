import { util, extensions } from '@aws-appsync/utils'
export const request = () => ({ });

export const response = (ctx) => {
    const filter = {
         roomId: { eq: ctx.arguments.roomId }
         //memberId: { eq: ctx.arguments.memberId }
    }
    extensions.setSubscriptionFilter(util.transform.toSubscriptionFilter(filter))
    return null;
}