import axios from 'axios';
import xml2js from 'xml2js';
// import cheerio from 'cheerio';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const getHeaders = {
    'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
};
// deptURL = 'https://cis.ncu.edu.tw/Course/main/query/byUnion';

(async function getDepts() {
    let res = await axios.get('https://cis.ncu.edu.tw/Course/main/query/byUnion', {
        headers: getHeaders
    });
    let $ = cheerio.load(res.data);

    let colleges = $('#byUnion_table table > tbody').get().map((table, i) => {
        let collegeId = 'collegeI' + i;
        let collegeName = $(table).find('tr:nth-child(1) th').contents().eq(0).text();
        let departments = $(table).find('tr:nth-child(2) td ul li a').get().map(anchor => {
            let deptId = $(anchor).attr('href').replace('/Course/main/query/byUnion?dept=', '');
            let deptName = $(anchor).text().replace(/\(\d+\)$/, '');
            console.log(deptId, deptName);
            return { deptId, deptName , collegeId };
            // 不太清楚為什麼要回傳 collegeId，可能是為了後續的資料處理
        });
        return { collegeId, collegeName, departments };
    });

    console.log(colleges);


    // 創建 data 目錄（如果不存在）
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    // 將 colleges 輸出為 JSON 檔案
    const outputPath = path.join(dataDir, 'colleges.json');
    fs.writeFileSync(outputPath, JSON.stringify(colleges, null, 2), 'utf8');
    
    console.log(`✅ 資料已儲存至: ${outputPath}`);
    console.log(`📊 總共獲取了 ${colleges.length} 個學院的資料`);


    return colleges;
})();

// (async function getCorses() {
//     let cor = await axios.get('https://cis.ncu.edu.tw/Course/main/query/byUnion', {
//         headers: getHeaders,
//         params: {
//             id : deptId
//         }
//     })

//     let $ = cheerio.load(cor.data);
    
//     let courses = $('#item > tbody tr').get().map((row, i) => {
//         let $row = $(row);
//         let firstCell = $row.find('td:first-child').text().trim();
        
//         // 提取課程ID，格式可能是 "01001\nPE1011-A" 或類似格式
//         let courseIdParts = firstCell.split('\n').filter(part => part.trim() !== '');
//         let courseId = courseIdParts.join(''); // 組合成 "01001PE1011-A"
        
//         console.log('Course ID:', courseId);
//         return { courseId };
//     })
//     console.log(courses);
//     return courses;
// })();