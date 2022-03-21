import {
  Client,
  GetMe,
  GetUpdatesParams,
  Update,
  UpdateMessage,
  UpdateType,
} from "./deps.ts";

export abstract class UpdateEvent extends Event {
  abstract readonly payload: Update;
}

export class MessageUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: UpdateMessage) {
    super(UpdateType.MESSAGE_UPDATE);
  }
}

export class Bot {
  /** Bot information */
  public me!: GetMe;

  /** Telegram Bot API client */
  public client: Client;

  private readonly updatesEventTarget = new EventTarget();
  private pollingParams: GetUpdatesParams = {
    timeout: 30,
  };

  constructor(token: string);
  constructor(client: Client);
  constructor(tokenOrClient: string | Client) {
    if (tokenOrClient instanceof Client) {
      this.client = tokenOrClient;
    } else {
      this.client = new Client(tokenOrClient);
    }

    this.client.getMe().then((user) => (this.me = user));
  }

  public on(eventType: UpdateType, callback: (update: UpdateMessage) => void) {
    this.updatesEventTarget.addEventListener(eventType, {
      handleEvent: (event: UpdateEvent) => {
        callback(event.payload as any);
      },
    });
  }

  public async startPolling() {
    try {
      const updates = await this.client.getUpdates(this.pollingParams);

      if (updates.length) {
        this.pollingParams = {
          ...this.pollingParams,
          offset: updates[updates.length - 1].update_id + 1,
        };

        this.handleUpdates(updates);
      }
    } catch (error) {
      console.error(error);
    } finally {
      await this.startPolling();
    }
  }

  private toUpdateEvent(update: Update) {
    function isMessageUpdate(update: Update): update is UpdateMessage {
      return !!(update as UpdateMessage).message;
    }

    if (isMessageUpdate(update)) {
      return new MessageUpdateEvent(update);
    }
  }

  private handleUpdate(update: Update) {
    const updateEvent = this.toUpdateEvent(update);
    this.updatesEventTarget.dispatchEvent(updateEvent!);
  }

  private handleUpdates(updates: Update[]) {
    for (const update of updates) {
      this.handleUpdate(update);
    }
  }
}
