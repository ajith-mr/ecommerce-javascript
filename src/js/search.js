function searchResults(filteredProducts,searchItem) {
    if (filteredProducts.length > 0) {
        console.log('calling from search.js');
        let searchValue = searchItem.value;
        if (searchValue) {
          return searchResults = filteredProducts.filter((value) => {
            if (value.title.toLowerCase().includes(searchValue.toLowerCase())) {
              return value;
            }
          });
        } 
      } 
}

export { searchResults };