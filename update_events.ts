import {
  CallbackQueryUpdate,
  ChannelPostUpdate,
  ChatJoinRequestUpdate,
  ChatMemberUpdate,
  ChosenInlineResultUpdate,
  EditedChannelPostUpdate,
  EditedMessageUpdate,
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

export abstract class UpdateEvent extends Event {
  abstract readonly payload: Update;
}

export class MessageUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: MessageUpdate) {
    super(UpdateType.MESSAGE);
  }
}

export class EditedMessageUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: EditedMessageUpdate) {
    super(UpdateType.EDITED_MESSAGE);
  }
}

export class ChannelPostUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: ChannelPostUpdate) {
    super(UpdateType.CHANNEL_POST);
  }
}

export class EditedChannelPostUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: EditedChannelPostUpdate) {
    super(UpdateType.EDITED_CHANNEL_POST);
  }
}

export class InlineQueryUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: InlineQueryUpdate) {
    super(UpdateType.INLINE_QUERY);
  }
}

export class ChosenInlineResultUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: ChosenInlineResultUpdate) {
    super(UpdateType.CHOSEN_INLINE_RESULT);
  }
}

export class CallbackQueryUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: CallbackQueryUpdate) {
    super(UpdateType.CALLBACK_QUERY);
  }
}

export class ShippingQueryUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: ShippingQueryUpdate) {
    super(UpdateType.SHIPPING_QUERY);
  }
}

export class PreCheckoutQueryUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: PreCheckoutQueryUpdate) {
    super(UpdateType.PRE_CHECKOUT_QUERY);
  }
}

export class PollUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: PollUpdate) {
    super(UpdateType.POLL);
  }
}

export class PollAnswerUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: PollAnswerUpdate) {
    super(UpdateType.POLL_ANSWER);
  }
}

export class MyChatMemberUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: MyChatMemberUpdate) {
    super(UpdateType.MY_CHAT_MEMBER);
  }
}

export class ChatMemberUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: ChatMemberUpdate) {
    super(UpdateType.CHAT_MEMBER);
  }
}

export class ChatJoinRequestUpdateEvent extends UpdateEvent {
  constructor(public readonly payload: ChatJoinRequestUpdate) {
    super(UpdateType.CHAT_JOIN_REQUEST);
  }
}
