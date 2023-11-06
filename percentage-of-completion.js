const fs = require('fs');
const readline = require('readline');
const cliProgress = require('cli-progress');

const fileName = 'free_company_dataset.csv';
const fileStats = fs.statSync(fileName);
const totalSize = fileStats.size;

const fileStream = fs.createReadStream(fileName, 'utf8');
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
});
const countryCounts = {};

const progressBar = new cliProgress.SingleBar({
    format: 'Progress [{bar}] {percentage}% | {value}/{total} | ETA: {eta}s | Duration: {duration}s',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
    stopOnComplete: true,
    barsize: 30,
    speed: 100,
    total: totalSize,
});
progressBar.start(totalSize, 0, { animated: true });

let processedSize = 0;

fileStream.on('data', (chunk) => {
const buf=Buffer.from(chunk);
processedSize+= buf.length;
progressBar.update(processedSize);
});

async function processLine(line) {
    const columns = line.split(',');
    const country = columns[0].trim();
    if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
    }
    await new Promise(resolve => setTimeout(resolve, 10));
}
rl.on('line', processLine);
rl.on('close', () => {
    progressBar.stop();
    for (const country in countryCounts) {
        // eslint-disable-next-line
        console.log(`${country} - ${countryCounts[country]}`);
    }
});

