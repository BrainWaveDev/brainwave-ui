export const isGeneratedId = (id: number) => {
    return id > 100_000_000_000;
}

export const randomNumberId = () => {
  // generate a random number between 100,000,000 and Number.MAX_SAFE_INTEGER
  // temprory holder for id, replace with db generated id later
  const minValue = 100_000_000_000;
  const maxValue = Number.MAX_SAFE_INTEGER;

  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
} 
