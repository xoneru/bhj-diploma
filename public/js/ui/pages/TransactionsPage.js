/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
 class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Нет элемента");
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener("click", (event) => {
      if (event.target.closest(".remove-account")) {
        this.removeAccount();
      }
      if (event.target.closest(".transaction__remove")) {
        const id = event.target
          .closest(".transaction__remove")
          .getAttribute("data-id");
        this.removeTransaction(id);
      }
    });

    // if (document.getElementsByClassName('transaction__remove')[0]) {
    //   document.getElementsByClassName('transaction__remove')[0].addEventListener('click', () => {
    //     this.removeTransaction(this.lastOptions.account_id);
    //   })
    // }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    } else {
      if (confirm("Вы действительно хотите удалить счёт?")) {
        Account.remove({ id: this.lastOptions.account_id }, (err, resp) => {
          if (resp) {
            App.update();
            App.updateWidgets();
            App.updateForms();
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (confirm("Вы действительно хотите удалить эту транзакцию?")) {
      Transaction.remove({ id: id }, (err, resp) => {
        if (resp) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return;
    }
    this.lastOptions = options;

    Account.get(options.account_id, (err, resp) => {
      if (resp.success) {
        this.renderTitle(resp.data.name);
      }
    });

    Transaction.list({ account_id: options.account_id }, (err, resp) => {
      this.renderTransactions(resp.data);
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = "";
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.getElementsByClassName("content-title")[0].textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const formatedDate = new Date(date);

    const year = formatedDate.getFullYear();
    let month = formatedDate.getMonth();
    let day = formatedDate.getDate();
    const hours = formatedDate.getHours();
    let minutes = formatedDate.getMinutes();

    if (day < 10) {
      day = "0" + day;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (month === 0) {
      month = "января";
    } else if (month === 1) {
      month = "февраля";
    } else if (month === 2) {
      month = "марта";
    } else if (month === 3) {
      month = "апреля";
    } else if (month === 4) {
      month = "мая";
    } else if (month === 5) {
      month = "июня";
    } else if (month === 6) {
      month = "июля";
    } else if (month === 7) {
      month = "августа";
    } else if (month === 8) {
      month = "сентября";
    } else if (month === 9) {
      month = "октября";
    } else if (month === 10) {
      month = "ноября";
    } else if (month === 11) {
      month = "декабря";
    }

    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const date = this.formatDate(item.created_at);
    const type =
      item.type === "income" ? "transaction_income" : "transaction_expense";

    return `
    <div class="transaction ${type} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${date}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
          ${item.sum} <span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id=${item.id}>
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = this.element.getElementsByClassName("content")[0];

    content.innerHTML = "";

    data.forEach((transaction) => {
      content.insertAdjacentHTML(
        "beforeend",
        this.getTransactionHTML(transaction)
      );
    });
  }
}