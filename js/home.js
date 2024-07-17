let tbody = document.getElementById("tbodyId");
let btnFilter = document.getElementById("btnFilter");
let customers = [];
let transactions = [];
let chart;

async function getApi() {
  try {
    const response = await fetch("./js/json/data.json"); // Corrected path with quotes around file path
    const data = await response.json();
    customers = data.customers;
    transactions = data.transactions;
    displayData(customers, transactions);
    displayChart(transactions, customers);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayData(customers, transactions) {
  let cartona = "";
  for (let i = 0; i < customers.length; i++) {
    cartona += `
      <tr>
        <td>${customers[i].name}</td>
        <td>${transactions[i].amount}</td>
      </tr>
    `;
  }
  tbody.innerHTML = cartona;
}

async function filterData() {
  const nameFilter = document.getElementById("nameFilter").value.toLowerCase();
  const filteredCustomers = customers.filter(customer => customer.name.toLowerCase() === nameFilter);

  if (filteredCustomers.length > 0) {
    const filteredTransactions = transactions.filter(transaction => transaction.id === filteredCustomers[0].id);
    displayData(filteredCustomers, filteredTransactions);
    displayChart(filteredTransactions, filteredCustomers);
  } else {
    alert(`Customer with name "${nameFilter}" not found.`);
    // Reset display if no match found (optional)
    displayData(customers, transactions);
    displayChart(transactions, customers);
  }
}

function displayChart(transactions, customers) {
  if (chart) {
    chart.destroy();
  }

  chart = new Chart("myChart", {
    type: "line",
    data: {
      labels: customers.map(customer => customer.name),
      datasets: [{
        label: "Transaction Amount",
        borderColor: "black",
        data: transactions.map(transaction => transaction.amount),
      }]
    },
    options: {
      title: {
        display: true,
        text: "Customer Transactions"
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

// Event listener for filter button
btnFilter.addEventListener("click", filterData);

// Initialize by fetching data
getApi();
