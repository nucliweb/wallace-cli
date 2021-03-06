const {promisify} = require('util')
const fs = require('fs')
const test = require('ava')
const execa = require('execa')

const readFile = promisify(fs.readFile)

test(`it shows a table with stats if no options are passed and CSS is passed via STDIN`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', {
			input: 'a{}'
		}),
		readFile('./test/no-options/expected.txt', {
			encoding: 'utf8'
		})
	])

	t.deepEqual(actual, expected)
})

test(`it shows a table with stats if no options are passed and CSS is passed as argument`, async t => {
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['a{}']),
		readFile('./test/no-options/expected.txt', {
			encoding: 'utf8'
		})
	])

	t.deepEqual(actual, expected)
})

// @TODO: make this test work
/* eslint-disable ava/no-skip-test */
test.skip('it shows a table of stats if a valid url is passed', async t => {
	// @TODO: it would be better if this test wouldn't make
	// an actual HTTP request
	const [{stdout: actual}, expected] = await Promise.all([
		execa('./cli.js', ['https://file-huqyrptkwt.now.sh']),
		readFile('./test/no-options/expected.txt', {
			encoding: 'utf8'
		})
	])

	t.deepEqual(actual, expected)
})
/* eslint-enable ava/no-skip-test */

test('it exits with a non-zero exit code on invalid CSS', async t => {
	const {code} = await t.throwsAsync(
		// Intentional CSS Syntax Error
		execa('./cli.js', ['a{color    red}'])
	)

	t.is(code, 1)
})
