import { useMantineColorScheme } from "@mantine/core";

const useDark = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return { dark, toggleColorScheme };
};

export default useDark;
