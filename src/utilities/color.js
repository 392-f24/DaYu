export const getChipColor = (category) => {
  if (category === "sidewalk") return "primary";
  if (category === "traffic") return "secondary";
  return "thirdColor";
};
