const url = "https://fakestoreapi.com/products";

// function to fetch the data from API to UI
async function getDataFromAPIToUI() {
    try {
      console.log("getDataFromAPIToUI() from service called");
      const apiResponse = await fetch(url);
      if (apiResponse.status != 200) {
        throw new Error("Unable to Fetch the data");
      }
      const data = apiResponse.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  
}

export { getDataFromAPIToUI };
