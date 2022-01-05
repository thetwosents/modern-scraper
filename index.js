// A CLI to manage the modern-scraper project.
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer = require('inquirer');
const yargs = require('yargs');
const axios = require('axios');

// A CLI command to get all urls for a given domain.
yargs.command({
    command: 'get-urls',
    describe: 'Get all urls for a given domain.',
    builder: {
        domain: {
            describe: 'The domain to get urls for.',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        getUrls(argv.domain);
    }
});

async function getUrls(domain) {
    const urls = await axios.get(`https://api.modern-scraper.com/urls/${domain}`);
    console.log(urls.data);
}

// A CLI command to extract the HTML from a given url.
yargs.command({
    command: 'extract-html',
    describe: 'Extract the HTML from a given url.',
    builder: {
        url: {
            describe: 'The url to extract HTML from.',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        extractHtml(argv.url);
    }
});

async function extractHtml(url) {
    const html = await axios.get(`https://api.modern-scraper.com/html/${url}`);
    console.log(html.data);
}

// A CLI command to extract the HTML from all urls for a given domain and save it to a file.
yargs.command({
    command: 'extract-html-all',
    describe: 'Extract the HTML from all urls for a given domain and save it to a file.',
    builder: {
        domain: {
            describe: 'The domain to extract HTML from.',
            demandOption: true,
            type: 'string'
        },
        file: {
            describe: 'The file to save the HTML to.',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function (argv) {
        extractHtmlAll(argv.domain, argv.file);
    }
});

async function extractHtmlAll(domain, file) {
    const urls = await axios.get(`https://api.modern-scraper.com/urls/${domain}`);
    const html = await axios.get(`https://api.modern-scraper.com/html/all/${domain}`);
    fs.writeFileSync(file, html.data);
    console.log(`Saved HTML to ${file}`);
}

// A CLI command to bring up the CLI menu.
yargs.command({
    command: 'menu',
    describe: 'Bring up the CLI menu.',
    handler: function () {
        menu();
    }
});

function menu() {
    clear();
    console.log(
        chalk.yellow(
            figlet.textSync('Modern-Scraper', { horizontalLayout: 'full' })
        )
    );
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                'Get all urls for a domain',
                'Extract the HTML from a url',
                'Extract the HTML from all urls for a domain and save it to a file',
                'Exit'
            ]
        }
    ]).then(function (answers) {
        switch (answers.menu) {
            case 'Get all urls for a domain':
                getUrlsMenu();
                break;
            case 'Extract the HTML from a url':
                extractHtmlMenu();
                break;
            case 'Extract the HTML from all urls for a domain and save it to a file':
                extractHtmlAllMenu();
                break;
            case 'Exit':
                process.exit();
                break;
        }
    });
}