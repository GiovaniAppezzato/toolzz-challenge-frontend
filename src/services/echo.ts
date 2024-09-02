import Pusher from "pusher-js";
import Echo from "laravel-echo";

export default class EchoService {
  private static instance: Echo|null = null;

  public static initialize(accessToken?: string) {
    if(this.instance) {
      this.instance.disconnect();
    }

    const accessTokenString = accessToken ? `Bearer ${accessToken}` : null;

    this.instance = new Echo({
      broadcaster: "pusher",
      client: new Pusher(`${process.env.NEXT_PUBLIC_PUSHER_APP_KEY || ""}`, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "NaN",
        authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: accessTokenString
          }
        }
      })
    });
  }

  public static disconnect() {
    if(this.instance) {
      this.instance.disconnect();
    } 
  }

  public static getInstance() {
    return this.instance;
  }
}
