// Shorten an address to 0x8...6789
export const shortenAddress = (address: string) => {
  return `${address?.slice(0, 5)}...${address?.slice(-4)}`;
};
