export const getChipColor = (category) => {
  if (category === "pathways") return "primary";
  if (category === "traffic") return "secondary";
  return "thirdColor";
};
