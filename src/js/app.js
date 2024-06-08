import { getDataFromAPIToUI } from "./service/fetchResults.js";
import { searchResults } from "./search.js";
import { sortResults } from "./sort.js"


document.addEventListener("DOMContentLoaded", initialise);

// Initialiser Function
function initialise() {
  console.log('Init Called');
  getData();
  filterProductsInit();
  updatePagination();
}

let loader = `<div class="loader"></div>`;

const searchItem = document.querySelector("#searchItems");
const sortItem = document.querySelector("#sortItems");
const totalCount = document.querySelector("#total");
const categoryCheckboxes = document.querySelectorAll(".category");
const loadMoreButton = document.getElementById("load-more");
let scrollTopBtn = document.getElementById("scrollTopBtn");
const allProductsElement = document.querySelector(".products");
const pagination = document.getElementById('pagination'); 
const prevButton = document.getElementById('prev'); 
const nextButton = document.getElementById('next'); 
const pageLinks = document.querySelectorAll('.page-link');
const dataContainer = document.querySelector('.products'); 

let products = []; 
let filteredProducts = [];
let currentPage=1;

let displayedProducts = 0;
const productsPerPage = 10;
const cards =  Array.from(dataContainer.getElementsByClassName('.products'));
const totalPages = Math.ceil(cards.length / productsPerPage); 

// Function that fetches the data from the WebApi and display the results on app
async function getData() {
  try {
    allProductsElement.innerHTML = loader;
    const data = await getDataFromAPIToUI();
    products = [...data];
    filteredProducts = [...data];
    allProductsElement.innerHTML = "";
    displayProducts(filteredProducts);
    updatePagination();
  } catch (error) {
    allProductsElement.innerHTML = `<h2 style="color:red;">Something went wrong, Please try again</h2>`;
    console.error("Error while fetching the data:", error);
  }
}

// Function to display the values on the app
function displayProducts(items) {
  if (items.length > 0) {
    totalCount.innerHTML = `<span>${items.length} results</span>`;
    for (
      let i = displayedProducts;
      i < Math.min(displayedProducts + productsPerPage, items.length);
      i++
    ) {
      allProductsElement.insertAdjacentHTML(
        "beforeend",
        `        
            <div class="product">
                <div class="product-img">
                    <img src=${items[i].image}>
                </div>
                <div class="product-info">
                    <h3>${items[i].title}</h3>
                    <p>$${items[i].price}</p>
                    <i class="fa fa-heart" aria-hidden></i>
                </div>
            </div>
        `
      );
    }

    displayedProducts += productsPerPage;

    if (displayedProducts >= items.length) {
      loadMoreButton.style.display = "none";
    } else {
      loadMoreButton.style.display = "block";
    }
  } else {
    totalCount.innerHTML = "No results found";
    allProductsElement.innerHTML = `<h2 style="color:red;">No results found</h2>`;
  }
}

// Filter results based on filter criteria
function filterProducts() {
  if (navigator.onLine) {
    const checkedItems = [];
    
    for (let i = 0; i < categoryCheckboxes.length; i++) {
      if (categoryCheckboxes[i].checked) {
        checkedItems.push(categoryCheckboxes[i].value);
      }
    }
    const filteredProds = products.filter((product) => {
      if (checkedItems.includes(product.category.toLowerCase())) {
        return product;
      }
    });
    const filteredItems = filteredProds.length > 0 ? filteredProds : products;
    filteredProducts = [...filteredItems];

    displayedProducts = 0;
    allProductsElement.innerHTML = "";
    displayProducts(filteredProducts);
  } else {
    allProductsElement.innerHTML =
      `<h2 style="color:red;">Problem with the Internet, Please try again</h2>`;
  }
}

function filterProductsInit() {
  for (let i = 0; i < categoryCheckboxes.length; i++) {
    categoryCheckboxes[i].addEventListener("click", filterProducts);
  }
}

window.onscroll = function() {scrollFunction()};

// pagination update
function updatePagination() { 
  prevButton.disabled = currentPage === 1; 
  nextButton.disabled = currentPage === totalPages; 
  pageLinks.forEach((link) => { 
      const page = parseInt(link.getAttribute('data-page')); 
      link.classList.toggle('active', page === currentPage); 
  }); 
} 

prevButton.addEventListener('click', () => { 
  if (currentPage > 1) { 
      currentPage--; 
      displayProducts(currentPage); 
      updatePagination(); 
  } 
}); 

// Event listener for "Next" button 
nextButton.addEventListener('click', () => { 
  if (currentPage < totalPages) { 
      currentPage++; 
      displayProducts(currentPage); 
      updatePagination(); 
  } 
});

pageLinks.forEach((link) => { 
  link.addEventListener('click', (e) => { 
      e.preventDefault(); 
      const page = parseInt(link.getAttribute('data-page')); 
      if (page !== currentPage) { 
          currentPage = page; 
          displayPage(currentPage); 
          updatePagination(); 
      } 
  }); 
}); 

// function to show arrow to scroll to top 
function scrollFunction() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
}

// scrolls to top
scrollTopBtn.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
})

// sorts the values based on sort criteria
sortItem.addEventListener("change", () => {
  if (filteredProducts.length > 0) {
    const val = sortItem.options[sortItem.selectedIndex].value;
    const sortedProducts = sortResults(val,filteredProducts)
    displayedProducts = 0;
    allProductsElement.innerHTML = "";
    displayProducts(sortedProducts);
  }
});

// Searches the result based on search criteria
searchItem.addEventListener("change", () => {
  if (filteredProducts.length > 0) {
    const data = searchResults(filteredProducts,searchItem);
      displayedProducts = 0;
      allProductsElement.innerHTML = "";
      displayProducts(data);
  } 
  if (!navigator.onLine) {
    allProductsElement.innerHTML =
      `<h2 style="color:red;">No Internet, Please check the internet and try again</h2>`;
  }
});

loadMoreButton.addEventListener("click", function () {
  displayProducts(filteredProducts);
});
