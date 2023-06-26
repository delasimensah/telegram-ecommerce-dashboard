import { FC } from "react";
import {
  ActionIcon,
  Avatar,
  Flex,
  Group,
  Header as MantineHeader,
  Sx,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  HamburgerMenu,
  RefineThemedLayoutV2HeaderProps,
} from "@refinedev/mantine";
import { IconMoonStars, IconSun } from "@tabler/icons";

import { useDark } from "@lib/hooks";

const Header: FC<RefineThemedLayoutV2HeaderProps> = ({ sticky }) => {
  const theme = useMantineTheme();

  const { dark, toggleColorScheme } = useDark();

  const borderColor = dark ? theme.colors.dark[6] : theme.colors.gray[2];

  let stickyStyles: Sx = {};
  if (sticky) {
    stickyStyles = {
      position: `sticky`,
      top: 0,
      zIndex: 1,
    };
  }

  return (
    <MantineHeader
      zIndex={199}
      height={64}
      py={6}
      px="sm"
      sx={{
        borderBottom: `1px solid ${borderColor}`,
        ...stickyStyles,
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        sx={{
          height: "100%",
        }}
      >
        <HamburgerMenu />

        <Group>
          <ActionIcon
            variant="subtle"
            color={dark ? "yellow" : "primary"}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
          </ActionIcon>

          <Group spacing="xs">
            <Avatar color="cyan" radius="xl">
              A
            </Avatar>
            <Title order={6}>Administrator</Title>
          </Group>
        </Group>
      </Flex>
    </MantineHeader>
  );
};

export default Header;
