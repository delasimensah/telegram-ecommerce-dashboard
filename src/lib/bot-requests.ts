import axios from "axios";

export const sendBotMessage = async (id: string, text: string) => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}/sendMessage`,
      {
        chat_id: id,
        parse_mode: "HTML",
        text,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const sendInviteBroadcast = async (id: string) => {
  await axios.post(`${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}/sendMessage`, {
    chat_id: id,
    parse_mode: "HTML",
    text: "Some products have been moved to this store. Click /start to view them",
  });
};
