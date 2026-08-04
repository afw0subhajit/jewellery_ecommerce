export const getCartToken = () => {
  let token = localStorage.getItem("cart_token");

  if (!token) {
    token = crypto.randomUUID();

    localStorage.setItem(
      "cart_token",
      token
    );
  }

  return token;
};

export const clearCartToken = () => {
  localStorage.removeItem(
    "cart_token"
  );
};