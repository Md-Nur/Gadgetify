import prisma from "@/prisma/client";
import generateToken, { getTokenData } from "./Token";

export async function getCart(cartId) {
  const cart = cartId
    ? await prisma.order.findUnique({
        where: {
          id: cartId,
        },
        include: {
          items: { include: { product: true } },
        },
      })
    : null;
  if (cart)
    return {
      ...cart,
      size: cart.items.reduce((acc, items) => acc + items.quantity, 0),
      subtotal: cart.items.reduce(
        (acc, items) => acc + items.quantity * items.product.price,
        0
      ),
    };
  return cart;
}

export async function createCart() {
  const newCart = await prisma.order.create({
    data: {},
  });

  // cookies().set("localCart", generateToken({ cartId: newCart.id }));
  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
}
