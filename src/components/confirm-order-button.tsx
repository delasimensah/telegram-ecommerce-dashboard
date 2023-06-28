import { FC, useState } from "react";
import { Button, Group, Menu } from "@mantine/core";
import { useUpdate } from "@refinedev/core";
import { sendBotMessage } from "@lib/bot-requests";

type ConfirmOrderButtonProps = {
  userId: string;
  orderId: string;
};

const ConfirmOrderButton: FC<ConfirmOrderButtonProps> = ({
  userId,
  orderId,
}) => {
  const { mutate, isLoading } = useUpdate();
  const [opened, setOpened] = useState(false);

  const confirmOrder = async () => {
    mutate({
      resource: "orders",
      values: {
        paymentStatus: "paid",
        orderStatus: "confirmed",
      },
      id: orderId,
    });

    await sendBotMessage(
      userId,
      `
Payment received.
Your order will be delivered within a few hours.
NOTE: For safety and security reasons, orders placed after 6pm may not be delivered until the following morning, we appreciate your patience.
On arrival, kindly pay the applicable delivery fee and collect your item(s).
Thank you and come again.
    `
    );

    setOpened(false);
  };

  return (
    <Menu
      withArrow
      arrowPosition="center"
      position="bottom"
      opened={opened}
      onChange={setOpened}
      zIndex={1000}
    >
      <Menu.Target>
        <Button>Confirm Order</Button>
      </Menu.Target>

      <Menu.Dropdown
        sx={{
          padding: "10px",
        }}
      >
        <Menu.Label>Are you sure?</Menu.Label>

        <Group>
          <Button
            onClick={() => setOpened(false)}
            variant="outline"
            color="red"
            size="xs"
          >
            No
          </Button>

          <Button color="green" loading={isLoading} onClick={confirmOrder}>
            Yes
          </Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ConfirmOrderButton;
