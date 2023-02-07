import { UrlHealthProcess } from "../../url_health_process/schemas/url_health_process.schema";
import { EmailNotifier } from "./email.notifier";
import { INotifier } from "./notifier.interface";
import { WebhooksNotifier } from "./webhooks.notifier";

export class NotifiersDriver implements INotifier {
  private _notifiers: INotifier[] = [];

  constructor(process: UrlHealthProcess) {
    const { webhook, user } = process;

    const emailNotifier = new EmailNotifier(user.email);
    this._notifiers.push(emailNotifier);
    if (webhook) {
      console.log(webhook);
      this._notifiers.push(new WebhooksNotifier(webhook));
    }
  }

  async notify(subject: string, body: string) {
    const promises = this._notifiers.map((notifier) =>
      notifier.notify(subject, body),
    );

    return Promise.all(promises);
  }
}
