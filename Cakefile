fs = require 'fs'
{print} = require 'sys'
{spawn} = require 'child_process'

watch = (callback) ->
    coffee = spawn 'coffee', ['-c', '-w', './']
    coffee.stderr.on 'data', (data) ->
        process.stderr.write data.toString()
    coffee.stdout.on 'data', (data) ->
        print data.toString()
    coffee.on 'exit', (code) ->
        callback?() if code is 0

task 'watch', 'Build lib/ from src/', ->
    watch()