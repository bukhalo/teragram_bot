import {
  CallbackQueryUpdate,
  ChannelPostUpdate,
  ChatJoinRequestUpdate,
  ChatMemberUpdate,
  ChosenInlineResultUpdate,
  Client,
  EditedChannelPostUpdate,
  EditedMessageUpdate,
  GetMe,
  GetUpdatesParams,
  InlineQueryUpdate,
  MessageUpdate,
  MyChatMemberUpdate,
  PollAnswerUpdate,
  PollUpdate,
  PreCheckoutQueryUpdate,
  ShippingQueryUpdate,
  Update,
} from "./deps.ts";
import { UpdateType } from "./types/update_type.ts";
import {
  CallbackQueryUpdateEvent,
  ChannelPostUpdateEvent,
  ChatJoinRequestUpdateEvent,
  ChatMemberUpdateEvent,
  ChosenInlineResultUpdateEvent,
  EditedChannelPostUpdateEvent,
  EditedMessageUpdateEvent,
  InlineQueryUpdateEvent,
  MessageUpdateEvent,
  MyChatMemberUpdateEvent,
  PollAnswerUpdateEvent,
  PollUpdateEvent,
  PreCheckoutQueryUpdateEvent,
  ShippingQueryUpdateEvent,
  UpdateEvent,
} from "./update_events.ts";

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

  public on(
    eventType: UpdateType.MESSAGE,
    callback: (update: MessageUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.EDITED_MESSAGE,
    callback: (update: EditedMessageUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.CHANNEL_POST,
    callback: (update: ChannelPostUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.EDITED_CHANNEL_POST,
    callback: (update: EditedChannelPostUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.INLINE_QUERY,
    callback: (update: InlineQueryUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.CHOSEN_INLINE_RESULT,
    callback: (update: ChosenInlineResultUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.CALLBACK_QUERY,
    callback: (update: CallbackQueryUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.SHIPPING_QUERY,
    callback: (update: ShippingQueryUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.PRE_CHECKOUT_QUERY,
    callback: (update: PreCheckoutQueryUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.POLL,
    callback: (update: PollUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.POLL_ANSWER,
    callback: (update: PollAnswerUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.MY_CHAT_MEMBER,
    callback: (update: MyChatMemberUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.CHAT_MEMBER,
    callback: (update: ChatMemberUpdate) => void,
  ): void;
  public on(
    eventType: UpdateType.CHAT_JOIN_REQUEST,
    callback: (update: ChatJoinRequestUpdate) => void,
  ): void;
  public on(eventType: UpdateType, callback: {
    (update: MessageUpdate): void;
    (update: EditedMessageUpdate): void;
    (update: ChannelPostUpdate): void;
    (update: EditedChannelPostUpdate): void;
    (update: InlineQueryUpdate): void;
    (update: ChosenInlineResultUpdate): void;
    (update: CallbackQueryUpdate): void;
    (update: ShippingQueryUpdate): void;
    (update: PreCheckoutQueryUpdate): void;
    (update: PollUpdate): void;
    (update: PollAnswerUpdate): void;
    (update: MyChatMemberUpdate): void;
    (update: ChatMemberUpdate): void;
    (update: ChatJoinRequestUpdate): void;
  }): void {
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
    const isMessageUpdate = (update: Update): update is MessageUpdate => {
      return !!(update as MessageUpdate).message;
    };

    const isEditedMessageUpdate = (
      update: Update,
    ): update is EditedMessageUpdate => {
      return !!(update as EditedMessageUpdate).edited_message;
    };

    const isChannelPostUpdate = (
      update: Update,
    ): update is ChannelPostUpdate => {
      return !!(update as ChannelPostUpdate).channel_post;
    };

    const isEditedChannelPostUpdate = (
      update: Update,
    ): update is EditedChannelPostUpdate => {
      return !!(update as EditedChannelPostUpdate).edited_channel_post;
    };

    const isInlineQueryUpdate = (
      update: Update,
    ): update is InlineQueryUpdate => {
      return !!(update as InlineQueryUpdate).inline_query;
    };

    const isChosenInlineResultUpdate = (
      update: Update,
    ): update is ChosenInlineResultUpdate => {
      return !!(update as ChosenInlineResultUpdate).chosen_inline_result;
    };

    const isCallbackQueryUpdate = (
      update: Update,
    ): update is CallbackQueryUpdate => {
      return !!(update as CallbackQueryUpdate).callback_query;
    };

    const isShippingQueryUpdate = (
      update: Update,
    ): update is ShippingQueryUpdate => {
      return !!(update as ShippingQueryUpdate).shipping_query;
    };

    const isPreCheckoutUpdate = (
      update: Update,
    ): update is PreCheckoutQueryUpdate => {
      return !!(update as PreCheckoutQueryUpdate).pre_checkout_query;
    };

    const isPollUpdate = (update: Update): update is PollUpdate => {
      return !!(update as PollUpdate).poll;
    };

    const isPollAnswerUpdate = (update: Update): update is PollAnswerUpdate => {
      return !!(update as PollAnswerUpdate).poll_answer;
    };

    const isMyChatMemberUpdate = (
      update: Update,
    ): update is MyChatMemberUpdate => {
      return !!(update as MyChatMemberUpdate).my_chat_member;
    };

    const isChatMemberUpdate = (update: Update): update is ChatMemberUpdate => {
      return !!(update as ChatMemberUpdate).chat_member;
    };

    const isChatJoinRequestUpdate = (
      update: Update,
    ): update is ChatJoinRequestUpdate => {
      return !!(update as ChatJoinRequestUpdate).chat_join_request;
    };

    if (isMessageUpdate(update)) {
      return new MessageUpdateEvent(update);
    }

    if (isEditedMessageUpdate(update)) {
      return new EditedMessageUpdateEvent(update);
    }

    if (isChannelPostUpdate(update)) {
      return new ChannelPostUpdateEvent(update);
    }

    if (isEditedChannelPostUpdate(update)) {
      return new EditedChannelPostUpdateEvent(update);
    }

    if (isInlineQueryUpdate(update)) {
      return new InlineQueryUpdateEvent(update);
    }

    if (isChosenInlineResultUpdate(update)) {
      return new ChosenInlineResultUpdateEvent(update);
    }

    if (isCallbackQueryUpdate(update)) {
      return new CallbackQueryUpdateEvent(update);
    }

    if (isShippingQueryUpdate(update)) {
      return new ShippingQueryUpdateEvent(update);
    }

    if (isPreCheckoutUpdate(update)) {
      return new PreCheckoutQueryUpdateEvent(update);
    }

    if (isPollUpdate(update)) {
      return new PollUpdateEvent(update);
    }

    if (isPollAnswerUpdate(update)) {
      return new PollAnswerUpdateEvent(update);
    }

    if (isMyChatMemberUpdate(update)) {
      return new MyChatMemberUpdateEvent(update);
    }

    if (isChatMemberUpdate(update)) {
      return new ChatMemberUpdateEvent(update);
    }

    if (isChatJoinRequestUpdate(update)) {
      return new ChatJoinRequestUpdateEvent(update);
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
