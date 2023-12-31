import React from "react";
import dayjs from "dayjs";
import { Show, NumberField } from "@refinedev/mantine";
import { useShow } from "@refinedev/core";
import { Title, Group, Text, Stack, Grid, Box, Badge } from "@mantine/core";
import { Order } from "@lib/types";
import { ConfirmOrderButton, CancelOrderButton } from "@components";

const ShowOrder = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const order = data?.data as Order;

  return (
    <Show
      title={
        <Title fw={700} order={3}>
          Order Details
        </Title>
      }
      isLoading={isLoading}
    >
      <Grid gutter={50} mt={5}>
        <Grid.Col span={12}>
          <Stack spacing={30}>
            <Group spacing={30}>
              <Text size="md" fw={300}>
                <Box component="span" fw={700}>
                  Order ID:
                </Box>{" "}
                {order?.id}
              </Text>
              <Text size="md">
                <Box component="span" fw={700}>
                  Order:
                </Box>{" "}
                #{order?.orderNumber}
              </Text>
              <Text size="md">
                <Box component="span" fw={700}>
                  Placed On:
                </Box>{" "}
                {dayjs(order?.createdAt).format("MMM D, YYYY h:mm A")}
              </Text>
            </Group>

            <Group grow>
              <Stack spacing={12}>
                <Title order={4}>Payment Status</Title>
                {order?.paymentStatus === "paid" && (
                  <Badge size="xl" color="green" tt="capitalize">
                    {order?.paymentStatus}
                  </Badge>
                )}

                {order?.paymentStatus === "unpaid" && (
                  <Badge size="xl" color="red" tt="capitalize">
                    {order?.paymentStatus}
                  </Badge>
                )}
              </Stack>

              <Stack spacing={12}>
                <Title order={4}>Order Status</Title>

                {order?.orderStatus === "pending" && (
                  <Badge color="yellow" size="xl" tt="capitalize">
                    {order?.orderStatus}
                  </Badge>
                )}

                {order?.orderStatus === "confirmed" && (
                  <Badge color="green" size="xl" tt="capitalize">
                    {order?.orderStatus}
                  </Badge>
                )}

                {order?.orderStatus === "cancelled" && (
                  <Badge color="red" size="xl" tt="capitalize">
                    {order?.orderStatus}
                  </Badge>
                )}
              </Stack>
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col xl={6}>
          <Stack spacing={12}>
            <Title order={4}>Products</Title>

            <Stack spacing={12}>
              {order?.products.map((product) => {
                return (
                  <Group grow key={product?.id}>
                    <Group noWrap>
                      <Text size="sm" fw={700}>
                        {product?.name}
                      </Text>
                    </Group>

                    <Group spacing={0}>
                      <Text size="sm">{product?.quantity}x GH₵</Text>
                      <NumberField
                        size="sm"
                        value={product?.amount.toFixed(2)}
                      />
                    </Group>
                  </Group>
                );
              })}

              <Group grow mt={10}>
                <Title order={4}>Order Total: </Title>

                <Group spacing={0} fw={700}>
                  GH₵
                  <NumberField size="lg" value={order?.total.toFixed(2)} />
                </Group>
              </Group>
            </Stack>
          </Stack>
        </Grid.Col>

        <Grid.Col xl={6} style={{ minHeight: 120 }}>
          <Stack>
            <Text size="md">
              <Box component="span" fw={700}>
                User ID:
              </Box>{" "}
              {order?.userId}
            </Text>

            <Text size="md">
              <Box component="span" fw={700}>
                Username:
              </Box>{" "}
              {order?.username}
            </Text>

            <Text size="md">
              <Box component="span" fw={700}>
                Contact Number:
              </Box>{" "}
              +{order?.contactNumber}
            </Text>

            <Text size="md">
              <Box component="span" fw={700}>
                Payment Method:{" "}
              </Box>
              {order?.paymentMethod}
            </Text>
          </Stack>
        </Grid.Col>

        <Grid.Col span={12}>
          <Group position="right">
            {order?.orderStatus === "pending" &&
              order?.paymentStatus === "unpaid" && (
                <CancelOrderButton
                  orderId={order?.id as string}
                  userId={order?.userId as string}
                />
              )}

            {order?.orderStatus === "pending" &&
              order?.paymentStatus === "unpaid" && (
                <ConfirmOrderButton
                  orderId={order?.id as string}
                  userId={order?.userId as string}
                />
              )}
          </Group>
        </Grid.Col>
      </Grid>
    </Show>
  );
};

export default ShowOrder;
