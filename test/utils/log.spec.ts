import { beforeEach, describe, it } from '@jest/globals'
import { log } from '../../src/utils/log'

describe('env class', () => {
  beforeEach(() => {
    jest.resetModules()
    console.log = jest.fn()
  })

  it('Teste Log Function [Basic]', () => {
    log('ola')
    expect(console.log).toHaveBeenCalledTimes(1)
  })
})
