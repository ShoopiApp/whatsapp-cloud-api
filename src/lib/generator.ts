export function id(): string {
  const id = "xyxxyx"
    .replace(/y/g, () => (~~(Math.random() * 9) + 1).toString())
    .replace(/x/g, () => (~~(Math.random() * 10)).toString());
  return id;
}
