
import fs from 'fs';
import path from 'path';

function searchFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
                searchFiles(filePath);
            }
        } else {
            const content = fs.readFileSync(filePath, 'utf-8');
            if (content.includes('-20') || content.includes('20 moedas') || content.includes('moedas - 20')) {
                console.log(`Match in ${filePath}`);
            }
        }
    }
}

searchFiles('c:/Users/Felipe Kawakami/Aplicativos/src');
