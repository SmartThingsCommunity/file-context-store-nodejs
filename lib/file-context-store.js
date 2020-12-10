'use strict'

const path = require('path')
const fs = require('fs')
const encoding = 'utf-8'

module.exports = class FileContextStore {

	/**
	 * Create a context store instance
	 */
	constructor(directory = 'data') {
		this.directory = directory
		if (!fs.existsSync(this.directory)) {
			fs.mkdirSync(this.directory)
		}
	}

	/**
	 * Return the filename of the context store file for the specified installed app instance
	 * @param installedAppId
	 * @returns string
	 */
	filename(installedAppId) {
		return path.join(this.directory, `${installedAppId}.json`)
	}

	/**
	 * Read the context of the installed app instance
	 * @param installedAppId
	 * @returns {Promise<ContextRecord>}
	 */
	get(installedAppId) {
		return new Promise((resolve, reject) => {
			fs.exists(this.filename(installedAppId), (exists) => {
				if (exists) {
					fs.readFile(this.filename(installedAppId), encoding, (err, data) => {
						if (err) {
							reject(err)
						} else {
							resolve(JSON.parse(data))
						}
					})
				} else {
					resolve({})
				}
			})
		})
	}

	/**
	 * Puts the data into the context store
	 * @param {ContextRecord} params Context object
	 * @returns {Promise<AWS.Request<AWS.DynamoDB.GetItemOutput, AWS.AWSError>>|Promise<Object>}
	 */
	put(params) {
		return new Promise((resolve, reject) => {
			fs.writeFile(this.filename(params.installedAppId), JSON.stringify(params, null, 2), encoding, (err, data) => {
				if (err) {
					reject(err)
				} else {
					resolve(params)
				}
			})
		})
	}

	/**
	 * Updates the data in the context store by `installedAppId`
	 * @param {String} installedAppId Installed app identifier
	 * @param {ContextRecord} params Context object
	 * @returns {Promise<AWS.Request<AWS.DynamoDB.GetItemOutput, AWS.AWSError>>|Promise<Object>}
	 */
	async update(installedAppId, params) {
		const record = await this.get(installedAppId)
		for (const name of Object.keys(params)) {
			record[name] = params[name]
		}
		return this.put(record)
	}

	/**
	 * Delete the row from the table
	 * @param {String} installedAppId Installed app identifier
	 * @returns {Promise<AWS.Request<AWS.DynamoDB.GetItemOutput, AWS.AWSError>>|Promise<Object>}
	 */
	delete(installedAppId) {
		return new Promise((resolve, reject) => {
			fs.unlink(this.filename(installedAppId), (err) => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}
}
