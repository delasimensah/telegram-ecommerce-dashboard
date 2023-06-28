import { FC, useState } from "react";
import { Button, Group, Menu } from "@mantine/core";
import { useUpdate } from "@refinedev/core";

type BlockBottonProps = {
  blocked: boolean;
  id: string;
};

const BlockButton: FC<BlockBottonProps> = ({ blocked, id }) => {
  const { mutate, isLoading } = useUpdate();
  const [opened, setOpened] = useState(false);

  async function updateUser(value: string) {
    mutate({
      resource: "users",
      values: {
        blocked: value,
      },
      id,
    });
    setOpened(false);
  }

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
        <Button size="xs" color={blocked ? "green" : "red"} loading={isLoading}>
          {blocked ? "Unblock User" : "Block User"}
        </Button>
      </Menu.Target>

      <Menu.Dropdown
        sx={{
          padding: "10px",
        }}
      >
        <Group>
          <Button
            onClick={() => setOpened(false)}
            variant="outline"
            color="red"
            size="xs"
          >
            No
          </Button>

          <Button
            color="green"
            size="xs"
            onClick={() => {
              if (blocked) {
                updateUser("false");
              } else {
                updateUser("true");
              }
            }}
          >
            Yes
          </Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default BlockButton;
