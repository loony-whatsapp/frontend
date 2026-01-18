export const restructureDMandGM = (msgs: any) => {
  return {
    directMessages: msgs.directMessages.map((msg: any) => ({
      ...msg,
      context_id: msg.other_user_id,
      context_name: msg.other_user_name,
    })),
    groupMessages: msgs.groupMessages.map((msg: any) => ({
      ...msg,
      context_id: msg.group_id,
      context_name: msg.group_name,
    })),
  };
};

export const restructureDirectMessages = (msgs: any, otherUserId: number) => {
  return msgs.map((msg: any) => ({
    ...msg,
    context_id: otherUserId,
  }));
};

export const restructureDirectNewMessage = (body: any) => {
  return {
    ...body,
    receiver_id: body.other_user_id,
  };
};
