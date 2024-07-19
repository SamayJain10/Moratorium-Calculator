document.addEventListener('DOMContentLoaded', (event) => {
    const loanAmountInput = document.getElementById('loanAmount');
    const loanAmountRange = document.getElementById('loanAmountRange');
    const calculateButton = document.querySelector('button[type="button"]');
    const interestOverdueElement = document.querySelector('.interest-overdue-value');
    const selectedMonthsElement = document.getElementById('selectedMonths');

    function toggleActiveState(groupName) {
        const buttons = document.querySelectorAll(`input[name="${groupName}"]`);
        buttons.forEach(button => {
            button.addEventListener('change', (e) => {
                buttons.forEach(btn => {
                    btn.parentNode.classList.remove('active');
                });
                e.target.parentNode.classList.add('active');
                if (groupName === 'moratoriumMonths') {
                    selectedMonthsElement.textContent = e.target.id.replace('month', '');
                }
            });
        });
    }

    toggleActiveState('interestOption');
    toggleActiveState('moratoriumMonths');

    loanAmountRange.addEventListener('input', function() {
        let loanAmount = this.value;
        let formattedLoanAmount = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(loanAmount);
        loanAmountInput.value = formattedLoanAmount;
    });

    loanAmountInput.addEventListener('input', function() {
        let loanAmount = this.value.replace(/,/g, ''); 
        loanAmountRange.value = loanAmount;
    });

    // Function to calculate interest
    function calculateInterest() {
        const loanAmount = parseFloat(loanAmountInput.value.replace(/,/g, ''));
        const loanTenure = parseInt(document.getElementById('loanTenure').value);
        const interestRate = parseFloat(document.getElementById('interestRate').value);
        const emisPaid = parseInt(document.getElementById('emisPaid').value);
        const interestOption = document.querySelector('input[name="interestOption"]:checked').id;
        const moratoriumMonths = parseInt(document.querySelector('input[name="moratoriumMonths"]:checked').id.replace('month', ''));

        let interestOverdue = 0;

        if (interestOption === 'option1') {
            // After Moratorium Period
            interestOverdue = (loanAmount * (interestRate / 100 / 12)) * moratoriumMonths;
        } else if (interestOption === 'option2') {
            // Monthly (Like Credit Cards)
            interestOverdue = (loanAmount * Math.pow((1 + interestRate / 100 / 12), moratoriumMonths)) - loanAmount;
        }

        // Update the UI
        interestOverdueElement.textContent = `₹ ${interestOverdue.toFixed(2)}`;
    }

    // Event listener for the Calculate button
    calculateButton.addEventListener('click', calculateInterest);
});
