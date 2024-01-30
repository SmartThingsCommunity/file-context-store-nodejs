const path = require('path')
const fs = require('fs')

const fsp = fs.promises
const encoding = 'utf8'

module.exports = class FileContextStore {
	/**
	 * Create a context store instance. The directory will be created if it does not exist.
	 */
	constructor(directory = 'data') {
		this.directory = directory
		try {
			fs.mkdirSync(this.directory)
		} catch (error) {
			if (error.code !== 'EEXIST') {
				throw error
			}
		}
	}

	/**
	 * Read the context of the installed app instance
	 * @param installedAppId
	 * @returns {Promise<ContextObject>}
	 */
	async get(installedAppId) {
		try {
			const data = await fsp.readFile(this.filename(installedAppId), encoding)
			return JSON.parse(data)
		} catch (error) {
			if (error.code === 'ENOENT') {
				return undefined
			}
			throw error
		}
	}

	/**
	 * Puts the data into the context store
	 * @param {ContextObject} params Context object
	 * @returns {Promise<ContextObject>}
	 */
	async put(params) {
		await fsp.writeFile(this.filename(params.installedAppId), JSON.stringify({...params, state: {}}, null, 2), encoding)
		return params
	}

	/**
	 * Updates the data in the context store by `installedAppId`
	 * @param {String} installedAppId Installed app identifier
	 * @param {ContextObject} params Context object
	 * @returns {Promise<void>}
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
	 * @returns {Promise<void>}
	 */
	async delete(installedAppId) {
		await fsp.unlink(this.filename(installedAppId))
		await this.deleteStateDir(installedAppId)
	}

	/**
	 * Set the value of the key in the context store state property
	 * @param installedAppId the installed app identifier
	 * @param key the name of the property to set
	 * @param value the value to set
	 * @returns {Promise<*>}
	 */
	async setItem(installedAppId, key, value) {
		const filePath = path.join(this.directory, installedAppId, `${key}.json`)
		await fsp.mkdir(path.join(this.directory, installedAppId), {recursive: true})
		await fsp.writeFile(filePath, JSON.stringify(value), encoding)
	}

	/**
	 * Get the value of the key from the context store state property
	 * @param installedAppId the installed app identifier
	 * @param key the name of the property to retrieve
	 * @returns {Promise<*>}
	 */
	async getItem(installedAppId, key) {
		try {
			const filePath = path.join(this.directory, installedAppId, `${key}.json`)
			const data = await fsp.readFile(filePath, encoding)
			return JSON.parse(data)
		} catch (error) {
			if (error.code === 'ENOENT') {
				return undefined
			}
			throw error
		}
	}

	/**
	 * Remove the key from the context store state property
	 * @param installedAppId the installed app identifier
	 * @param key the name of the property to remove
	 * @returns {Promise<void>}
	 */
	async removeItem(installedAppId, key) {
		const filePath = path.join(this.directory, installedAppId, `${key}.json`)
		try {
			await fsp.unlink(filePath)
		} catch (error) {
			if (error.code !== 'ENOENT') {
				throw error
			}
		}
	}

	/**
	 * Clear the context store state property
	 * @param installedAppId the installed app identifier
	 * @returns {Promise<void>}
	 */
	async removeAllItems(installedAppId) {
		await this.deleteStateDir(installedAppId)
	}

	/**
	 * Return the filename of the context store file for the specified installed app instance
	 * @param installedAppId
	 * @returns string
	 */
	filename(installedAppId) {
		return path.join(this.directory, `${installedAppId}.json`)
	}

	async deleteStateDir(installedAppId) {
		try {
			const directoryPath = path.join(this.directory, installedAppId)
			await fsp.access(directoryPath)

			const files = await fsp.readdir(directoryPath)
			await Promise.all(files.map(async file => {
				const filePath = path.join(directoryPath, file)
				const stat = await fsp.stat(filePath)

				if (!stat.isDirectory()) {
					// Delete file
					await fsp.unlink(filePath)
				}
			}))

			// Delete the directory itself
			await fsp.rmdir(directoryPath)
		} catch (error) {
			if (error.code !== 'ENOENT') {
				throw error
			}
		}
	}
}
