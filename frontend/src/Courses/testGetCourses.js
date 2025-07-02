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

export async function getDepts() {
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
            let deptCourseNum = $(anchor).text().match(/\d+/);
            // let deptCourseNum = parseInt($(anchor).text().match(/\d+/)?.[0]) || 0;
            // console.log(deptId, deptName);
            return { deptId, deptName , collegeId, deptCourseNum};
            // 不太清楚為什麼要回傳 collegeId，可能是為了後續的資料處理
        });
        return { collegeId, collegeName, departments };
    });

    // console.log(colleges);

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
};

export async function getCorses(deptId, deptCourseNum) {
    let allCourses = [];
    let url = 'https://cis.ncu.edu.tw/Course/main/query/byUnion';
    let params = { dept: deptId };
    let deptPages = Math.ceil(deptCourseNum / 50);

    for (let page = 1; page <= deptPages; page++) {
        if (page > 1) {
            params['d-49489-p'] = page;
        }

        console.log(`爬取第${page}頁...`);
        let cor = await axios.get(url, {
            headers: getHeaders,
            params: params
        });

        let $ = cheerio.load(cor.data);
        
        let courses = $('#item > tbody tr').get().map((row, i) => {
            let $row = $(row);
            let $cells = $row.children('td');

            let td0 = $cells.eq(0);            
            // 提取課程ID，格式可能是 "01001\nPE1011-A" 或類似格式
            let courseIdParts = td0.text().split('\n').filter(part => part.trim() !== '');
            let serialNum = courseIdParts[0].trim(); // 取第一部分作為序號
            let courseId = courseIdParts[1]?.trim() || ''; // 取第二部分作為課程ID

            // 課程名稱
            let td1 = $cells.eq(1);
            let courseName = td1.text().split('\n')[0].trim(); // 取第一行作為課程名稱

            // 可能需要處理多位老師的情況
            let td2 = $cells.eq(2);
            let courseTeacher = td2.text().trim();

            // 學分數
            let td3 = $cells.eq(3);
            let courseCredit = Number(td3.text().trim()) || 0;

            //  時間、地點
            let td4 = $cells.eq(4).find('.classtime').text().trim();
            let courseTime = td4.split('/')[0].trim() || ''; // 取第一個時間段
            let courseLocation = td4.split('/')[1]?.trim() || '';

            // 選修、必修
            let td5 = $cells.eq(5);
            let courseType = td5.text().trim();

            // 全/半 這啥?
            let td6 = $cells.eq(6);
            let courseNote = td6.text().trim();

            // 選課人數限制
            let td7 = $cells.eq(7);
            let chooserLimit = td7.text().trim();
            
            console.log('Course ID:', courseId);
            return { courseId, serialNum, courseName, courseTeacher, courseCredit, courseTime, courseLocation, courseType, courseNote, chooserLimit };
        });
        
        allCourses.push(...courses);
        console.log(`第${page}頁課程:`, courses);
    }
    
    return allCourses;
}