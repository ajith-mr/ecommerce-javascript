function sortResults(val,filteredProducts) {
  return filteredProducts.sort((a, b) =>
    val === "low" ? a.price - b.price : b.price - a.price
  );
}

export { sortResults };