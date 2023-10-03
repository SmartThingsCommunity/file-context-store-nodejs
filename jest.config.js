module.exports = {
	collectCoverageFrom: ['lib/**/*.js'],
	coverageReporters: ['json', 'text'],
	testEnvironment: 'node',
	testPathIgnorePatterns: ['test/data'],
	testMatch: ['**/test/**/*.[jt]s?(x)'],
	setupFiles: ['<rootDir>/config/jest.setup.js'],
}
