/**
 * Merges a guest cart into a user's persistent cart.
 * Both carts follow the parallel array structure:
 * {
 *   productId: string[],
 *   productName: string[],
 *   productPrice: number[],
 *   productQuantity: number[]
 * }
 */
export function mergeCarts(userCart: any, guestCart: any) {
    if (!guestCart || !guestCart.productId || guestCart.productId.length === 0) {
        return userCart;
    }
    if (!userCart || !userCart.productId || userCart.productId.length === 0) {
        return guestCart;
    }

    const merged = {
        productId: [...userCart.productId],
        productName: [...userCart.productName],
        productPrice: [...userCart.productPrice],
        productQuantity: [...userCart.productQuantity],
    };

    guestCart.productId.forEach((gId: string, index: number) => {
        const existIndex = merged.productId.indexOf(gId);
        if (existIndex >= 0) {
            // Product exists in both, merge quantity
            merged.productQuantity[existIndex] += guestCart.productQuantity[index];
        } else {
            // New product from guest cart
            merged.productId.push(gId);
            merged.productName.push(guestCart.productName[index]);
            merged.productPrice.push(guestCart.productPrice[index]);
            merged.productQuantity.push(guestCart.productQuantity[index]);
        }
    });

    return merged;
}
