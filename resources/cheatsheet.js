//Remove keyboard
$.sendMessage(groupDetail, {
  reply_markup: JSON.stringify({
    remove_keyboard: true
  }),
  parse_mode: "HTML"
});
