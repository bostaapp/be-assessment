import { INotifier } from "./notifier.interface";

export class WebhooksNotifier implements INotifier {
  private _webhook: string;

  constructor(webhook: string) {
    this._webhook = webhook;
  }

  async notify(subject: string, body: string) {
    return Promise.resolve(
      "Couldn't be bothered to implement webhooks notification, but you get the idea, right?",
    );
  }
}
