import { FC, useState } from "react";
import { Button, Group, Menu } from "@mantine/core";
import { useUpdate } from "@refinedev/core";
import { sendBotMessage } from "@lib/bot-requests";

type CancelOrderButtonProps = {
  userId: string;
  orderId: string;
};

const CancelOrderButton: FC<CancelOrderButtonProps> = ({ userId, orderId }) => {
  const { mutate, isLoading } = useUpdate();
  const [opened, setOpened] = useState(false);

  const cancelOrder = async () => {
    try {
      mutate({
        resource: "orders",
        values: {
          paymentStatus: "unpaid",
          orderStatus: "cancelled",
        },
        id: orderId,
      });

      await sendBotMessage(
        userId,
        `
Your order has been <b>cancelled</b> because <b>mobile payment</b> was <b>NOT</b> received. 
Kindly restart the process to place your order. Thanks`
      );

      setOpened(false);
    } catch (error) {
      console.log(error);
    }
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
        <Button color="red">Cancel Order</Button>
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

          <Button color="green" loading={isLoading} onClick={cancelOrder}>
            Yes
          </Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default CancelOrderButton;
