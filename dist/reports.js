// ./dist/reports.js

document.addEventListener('DOMContentLoaded', () => {
    fetchStockData();
    fetchOrderData();

    document.getElementById('export-btn').addEventListener('click', exportPDF);
});

function fetchStockData() {
    fetch('/api/stock')
        .then(response => response.json())
        .then(data => {
            const stockBody = document.getElementById('stock-body');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.product}</td>
                    <td>${item.availability}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                `;
                stockBody.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching stock data:', err));
}

function fetchOrderData() {
    fetch('/api/orders')
        .then(response => response.json())
        .then(data => {
            const orderBody = document.getElementById('order-body');
            data.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.product}</td>
                    <td>${order.price}</td>
                    <td>${order.quantity}</td>
                    <td>${order.cartId}</td>
                `;
                orderBody.appendChild(row);
            });
        })
        .catch(err => console.error('Error fetching order data:', err));
}

function exportPDF() {
    const element = document.querySelector('.container');
    html2pdf().from(element).save('report.pdf');
}
