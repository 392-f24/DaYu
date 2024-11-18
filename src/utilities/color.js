export const getChipColor = (category) => {
  if (category === "Sidewalks") return "primary";
  if (category === "Traffic") return "secondary";
  return "thirdColor";
};
