/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
 class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(null, (err, resp) => {
      if (resp) {
        const select = this.element.querySelector("select");

        select.querySelectorAll("option").forEach((option) => {
          option.remove();
        });

        resp.data.forEach((data) => {
          const option = document.createElement("option");
          option.value = `${data.id}`;
          option.textContent = `${data.name}`;
          select.append(option);
        });
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, resp) => {
      console.log(data);
      if (resp && resp.success) {
        this.element.reset();
        App.getModal("newExpense").close();
        App.getModal("newIncome").close();
        App.update();
      }
    });
  }
}