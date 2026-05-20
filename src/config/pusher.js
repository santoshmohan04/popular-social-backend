import Pusher from "pusher";

export function createPusherClient(pusherConfig) {
  return new Pusher({
    appId: pusherConfig.appId,
    key: pusherConfig.key,
    secret: pusherConfig.secret,
    cluster: pusherConfig.cluster,
    useTLS: true
  });
}
