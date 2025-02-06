const apiKey = "67960fb80acc0626570d3648";
const transactionsUrl = "https://mokesellfed-153b.restdb.io/rest/transactions";

// Function to display cart items
async function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const tableBody = document.getElementById('transaction-table');

    // Clear the table body before appending new rows
    tableBody.innerHTML = '';

    if (cartItems.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No items in cart.</td></tr>';
        return;
    }

    cartItems.forEach(item => {
        const row = `<tr>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>In Cart</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Event listener for confirming payment
document.getElementById('confirm-payment').addEventListener('click', async () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartItems.length === 0) {
        alert('No items in cart to process payment.');
        return;
    }

    document.getElementById('payment-processing').classList.remove('hidden');

    try {
        for (const item of cartItems) {
            const response = await fetch(transactionsUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': apiKey,
                },
                body: JSON.stringify(item),
            });

            if (!response.ok) {
                throw new Error('Failed to process payment');
            }
        }

        document.getElementById('payment-processing').classList.add('hidden');
        document.getElementById('payment-success').classList.remove('hidden');

        localStorage.removeItem('cart');

        setTimeout(() => {
            window.location.href = 'browse-listings-page.html';
        }, 2000);
    } catch (error) {
        console.error('Error processing payment:', error);
        document.getElementById('payment-processing').classList.add('hidden');
        document.getElementById('transaction-error').classList.remove('hidden');
    }
});

// Display cart items when the page loads
document.addEventListener('DOMContentLoaded', displayCartItems);
document.getElementById('buy-now').addEventListener('click', displayCartItems);