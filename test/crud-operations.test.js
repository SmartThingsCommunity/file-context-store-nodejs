const { v4: uuid } = require('uuid')

const FileContextStore = require('../lib/file-context-store')

describe('crud-operations', () => {
	const contextStore = new FileContextStore('test/data')

	test('can put and get', async () => {
		const installedAppId = uuid()
		await contextStore.put({
			installedAppId,
			locationId: 'locationId',
			locale: 'ko-KR',
			authToken: 'authToken',
			refreshToken: 'refreshToken',
			config: {settings: 'something'},
		})

		const context = await contextStore.get(installedAppId)
		expect(context.installedAppId).toEqual(installedAppId)
		expect(context.locationId).toEqual('locationId')
		expect(context.authToken).toEqual('authToken')
		expect(context.refreshToken).toEqual('refreshToken')
		expect(context.locale).toEqual('ko-KR')
		expect(context.config).toEqual({settings: 'something'})

		await contextStore.delete(installedAppId)
	})

	test('can update', async () => {
		const installedAppId = uuid()
		await contextStore.put({
			installedAppId,
			locationId: 'locationId',
			authToken: 'authToken',
			refreshToken: 'refreshToken',
			config: {settings: 'something'}
		})

		await contextStore.update(installedAppId, {
			authToken: 'newAuthToken',
		})

		const context = await contextStore.get(installedAppId)
		expect(context.authToken).toEqual('newAuthToken')

		await contextStore.delete(installedAppId)
	})
})
