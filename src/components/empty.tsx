import { FC } from "react";
import { Center, Title } from "@mantine/core";

type EmptyProps = {
  text: string;
};

const Empty: FC<EmptyProps> = ({ text }) => {
  return (
    <Center mih="150px">
      <Title tt="capitalize" order={4} fw={700}>
        {text}
      </Title>
    </Center>
  );
};

export default Empty;
