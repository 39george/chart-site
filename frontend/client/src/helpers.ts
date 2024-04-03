export const format_price = (number_string: string) => {
  return number_string.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
