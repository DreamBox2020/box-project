import { makeAutoObservable } from 'mobx'

export class UserStore {
  public user: any = null
  public passport: any = null
  public statements: any[] = []

  constructor() {
    makeAutoObservable(this)
  }

  public setUser(user: any) {
    this.user = user
  }

  public setPassport(passport: any) {
    this.passport = passport
  }

  public setStatements(statements: any[]) {
    this.statements = statements
  }

  public clear() {
    this.user = null
    this.passport = null
    this.statements = []
  }

  public get isLogin() {
    return this.user !== null
  }

  public get isLogout() {
    return this.user === null
  }
}
