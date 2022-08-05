class Account extends Entity {
  static get(id = '', callback){
    createRequest({
      callback,
      method: 'GET',
      responseType: 'json',
      url: this.URL + '/' + id
    })
  }
}

Account.URL = '/account'
