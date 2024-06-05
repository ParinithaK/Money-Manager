import './index.css'
import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import MoneyDetails from '../MoneyDetails'
import TransactionItem from '../TransactionItem'

const transactionTypeOptions = [
  {
    optionId: 'INCOME',
    displayText: 'Income',
  },
  {
    optionId: 'EXPENSES',
    displayText: 'Expenses',
  },
]

class MoneyManager extends Component {
  state = {
    balanceAmount: 0,
    incomeAmount: 0,
    expensesAmount: 0,
    titleInput: '',
    amountInput: '',
    typeInput: transactionTypeOptions[0].optionId, // Set default type to 'INCOME'
    initialHistoryList: [],
  }

  onCreateHistory = () => {
    const {
      titleInput,
      amountInput,
      typeInput,
      incomeAmount,
      expensesAmount,
    } = this.state

    if (titleInput === '' || amountInput === '' || amountInput.isNaN) {
      return // Prevent adding if input is invalid
    }

    const amount = parseInt(amountInput)
    const selectedType = transactionTypeOptions.find(
      each => each.optionId === typeInput,
    )
    const {displayText} = selectedType

    const newHistoryItem = {
      id: uuidv4(),
      titleInput,
      amountInput: amount,
      typeInput: displayText, // Store displayText instead of optionId
    }

    let newIncomeAmount = incomeAmount
    let newExpensesAmount = expensesAmount

    if (displayText === 'Income') {
      newIncomeAmount += amount
    } else if (displayText === 'Expenses') {
      newExpensesAmount += amount
    }

    const newBalanceAmount = newIncomeAmount - newExpensesAmount

    this.setState(prevState => ({
      initialHistoryList: [...prevState.initialHistoryList, newHistoryItem],
      titleInput: '',
      amountInput: '',
      typeInput: transactionTypeOptions[0].optionId, // Reset type to default 'INCOME'
      incomeAmount: newIncomeAmount,
      expensesAmount: newExpensesAmount,
      balanceAmount: newBalanceAmount,
    }))
  }

  onChangeTitle = event => this.setState({titleInput: event.target.value})

  onChangeAmount = event => this.setState({amountInput: event.target.value})

  onChangeType = event => this.setState({typeInput: event.target.value})

  onDeleteHistory = id => {
    this.setState(prevState => {
      const filteredHistory = prevState.initialHistoryList.filter(
        each => each.id !== id,
      )

      let newIncomeAmount = 0
      let newExpensesAmount = 0

      filteredHistory.forEach(item => {
        if (item.typeInput === 'Income') {
          newIncomeAmount += item.amountInput
        } else if (item.typeInput === 'Expenses') {
          newExpensesAmount += item.amountInput
        }
      })

      const newBalanceAmount = newIncomeAmount - newExpensesAmount

      return {
        initialHistoryList: filteredHistory,
        incomeAmount: newIncomeAmount,
        expensesAmount: newExpensesAmount,
        balanceAmount: newBalanceAmount,
      }
    })
  }

  render() {
    const {
      balanceAmount,
      incomeAmount,
      expensesAmount,
      titleInput,
      amountInput,
      typeInput,
      initialHistoryList,
    } = this.state

    return (
      <div className="bg-container">
        <div className="indigo-container">
          <h1 className="profile-name">Hi, Richard</h1>
          <p className="description">
            Welcome back to your{' '}
            <span className="span-element">Money Manager</span>
          </p>
        </div>
        <div>
          <MoneyDetails
            balanceAmount={balanceAmount}
            incomeAmount={incomeAmount}
            expensesAmount={expensesAmount}
          />
        </div>
        <div className="add-transaction-history-container">
          <div className="add-transaction-container">
            <h1 className="add-transaction">Add Transaction</h1>
            <div className="label-inputs">
              <label htmlFor="title" className="label-design">
                TITLE
              </label>
              <input
                type="text"
                placeholder="TITLE"
                id="title"
                className="input-design"
                value={titleInput}
                onChange={this.onChangeTitle}
              />
            </div>
            <div className="label-inputs">
              <label htmlFor="amount" className="label-design">
                AMOUNT
              </label>
              <input
                type="text"
                placeholder="AMOUNT"
                id="amount"
                className="input-design"
                value={amountInput}
                onChange={this.onChangeAmount}
              />
            </div>
            <div className="label-inputs">
              <label htmlFor="select" className="label-design">
                TYPE
              </label>
              <select
                value={typeInput}
                id="select"
                className="input-design"
                onChange={this.onChangeType}
              >
                {transactionTypeOptions.map(each => (
                  <option key={each.optionId} value={each.optionId}>
                    {each.displayText}
                  </option>
                ))}
              </select>
              <button
                onClick={this.onCreateHistory}
                type="button"
                className="add-btn"
              >
                Add
              </button>
            </div>
          </div>
          <div className="add-transaction-container">
            <h1 className="add-transaction">History</h1>
            <div className="add-history-element">
              <div className="row-container">
                <p className="column-names">Title</p>
                <p className="column-names">Amount</p>
                <p className="column-names">Type</p>
              </div>
            </div>
            <ul className="add-history-element">
              {initialHistoryList.map(each => (
                <TransactionItem
                  initialHistoryList={each}
                  onDeleteHistory={this.onDeleteHistory}
                  key={each.id}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default MoneyManager
