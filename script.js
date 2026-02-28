let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let total = document.getElementById('total');
let body = document.getElementById('tbody');
let btnDeleteAll = document.getElementById('deleteAll');
let mood = 'create';
let temp;

// console.log(title, price, taxes, ads, discount, count, category, submit);
//Get   total
function gettotal() {
  if (price.value != '') {
    // لازم اتاكد ان المستخدم دخل قيمه للسعر مفيش ضرايب ولا تخفيض ولا اى حاجه هتشتغل من غير م نضيف السعر

    let result =
      (+price.value +
        +taxes.value +
        +ads.value -
        +(discount.value * (price.value / 100))) *
      +(count.value || 1);
    total.innerHTML = result;
    total.style.backgroundColor = 'green';
  } else {
    total.innerHTML = '';
    total.style.backgroundColor = 'rgb(142, 12, 12)';
  }
}

//create Product  احسن
let dataproduct;
if (localStorage.product != null) {
  dataproduct = JSON.parse(localStorage.getItem('product'));
} else {
  dataproduct = [];
}
submit.onclick = function () {
  // e.preventDefault();
  let newpro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };
  //count and add new product
  if (mood === 'create') {
    if (newpro.count > 1) {
      // لما ادوس عليها  بحط عدد الصفوف ال عايزاها تتضاف في الجدول
      for (let i = 0; i < newpro.count; i++) {
        dataproduct.push(newpro);
      }
    } else {
      dataproduct.push(newpro);
    }
  } else {
    dataproduct[temp] = newpro;
    mood = 'create';
    submit.innerHTML = 'Create';
    count.style.display = 'block';
  }

  //Save data in local storage

  localStorage.setItem('product', JSON.stringify(dataproduct));
  // console.log(localStorage.getItem('product'));

  //// calling the function clean the data
  clearData();
  // console.log(newpro);
  // console.log(dataproduct);
  showData();
};

//clear input data
function clearData() {
  title.value = '';
  price.value = '';
  taxes.value = '';
  ads.value = '';
  discount.value = '';
  count.value = '';
  category.value = '';
  total.innerHTML = '';
}
//read
function showData() {
  //  هتشتغل مجرد م ادوس   create
  let table = '';
  for (let i = 0; i < dataproduct.length; i++) {
    table += ` <tr>
                <td>${i + 1}</td>
                <td>${dataproduct[i].title}</td>
                <td>${dataproduct[i].price}</td>
                <td>${dataproduct[i].taxes}</td>
                <td>${dataproduct[i].discount}</td>
                <td>${dataproduct[i].total}</td>
                <td>${dataproduct[i].category}</td>
                <td><button onclick= "updateData(${i})"  type="button" id="update">Update</button></td>
                <td><button  type="button" onclick='deleteRow(${i})' id="delete">Delete</button></td>
              </tr>`;
  }

  document.getElementById('tbody').innerHTML = table;
  if (dataproduct.length > 0) {
    btnDeleteAll.innerHTML = `<button  onclick= "DleteAll()">Delete All (${dataproduct.length})</button>`;
  } else {
    btnDeleteAll.innerHTML = '';
  }
  gettotal();
}
//showData();
//delete
function deleteRow(i) {
  dataproduct.splice(i, 1);
  localStorage.product = JSON.stringify(dataproduct);
  // console.log(i);
  showData(); // عشان  لما امسح يعمبل ريفريش للصفحه تاني
}

// deleteAll
function DleteAll() {
  localStorage.clear();
  dataproduct.splice(0);
  showData();
}

//update
function updateData(i) {
  mood = 'update';
  title.value = dataproduct[i].title;
  price.value = dataproduct[i].price;
  taxes.value = dataproduct[i].taxes;
  ads.value = dataproduct[i].ads;
  discount.value = dataproduct[i].discount;
  category.value = dataproduct[i].category;
  count.style.display = 'none';
  submit.innerHTML = 'update';
  gettotal();
  temp = i;
  scroll({
    top: 0,
    behavior: 'smooth',
  });
}

// search
let searchMode = 'title';
function getSearchMode(id) {
  let search = document.getElementById('search');
  // search.focus();

  if (id == 'searchByTitle') {
    searchMode = 'title';
  } else {
    searchMode = 'category';
  }
  search.placeholder = 'search By ' + searchMode;

  search.focus();
  search.value = '';

  // if (id == '') searchByTitle searchCategory
  // console.log(searchMode);
}
function searchData(value) {
  let table = '';

  for (let i = 0; i < dataproduct.length; i++) {
    if (searchMode === 'title') {
      if (dataproduct[i].title.toLowerCase().includes(value.toLowerCase())) {
        table += `
          <tr>
            <td>${i + 1}</td>
            <td>${dataproduct[i].title}</td>
            <td>${dataproduct[i].price}</td>
            <td>${dataproduct[i].taxes}</td>
            <td>${dataproduct[i].discount}</td>
            <td>${dataproduct[i].total}</td>
            <td>${dataproduct[i].category}</td>
            <td><button type="button" onclick="updateData(${i})">Update</button></td>
            <td><button type="button" onclick="deleteRow(${i})">Delete</button></td>
          </tr>
        `;
      }
    } else if (searchMode === 'category') {
      if (dataproduct[i].category.toLowerCase().includes(value.toLowerCase())) {
        table += `
          <tr>
            <td>${i + 1}</td>
            <td>${dataproduct[i].title}</td>
            <td>${dataproduct[i].price}</td>
            <td>${dataproduct[i].taxes}</td>
            <td>${dataproduct[i].discount}</td>
            <td>${dataproduct[i].total}</td>
            <td>${dataproduct[i].category}</td>
            <td><button type="button" onclick="updateData(${i})">Update</button></td>
            <td><button type="button" onclick="deleteRow(${i})">Delete</button></td>
          </tr>
        `;
      }
    }
  }

  document.getElementById('tbody').innerHTML = table;
}
