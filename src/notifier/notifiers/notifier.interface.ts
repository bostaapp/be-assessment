export interface INotifier {
  notify(subject: string, body: string): Promise<any>;
}
