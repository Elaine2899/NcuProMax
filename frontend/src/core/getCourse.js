import { getDepts, getCorses } from '../Courses/testGetCourses.js';
import fs from 'fs';
import path from 'path';

let colleges = await getDepts();
colleges.forEach(college => {
    console.log()
    console.log()

    console.log(`${college.collegeId}: ${college.collegeName}`)
    college.departments.forEach(dept => {
        console.log(`  學系: ${dept.deptName}`)
        console.log(`  學系課程數: ${dept.deptCourseNum}`);
    })
})

// 收集所有課程資料
let allCourses = [];

for (let [collegeID, college] of colleges.entries()) {
    console.log(`獲取 ${college.collegeName} 的課程...`);
    let depts = college.departments;

    for (let [deptID, dept] of depts.entries()) {
        console.log(`  正在獲取 ${dept.deptName} 的課程...`);
        try {
            let courses = await getCorses(dept.deptId, dept.deptCourseNum);
            
            // 為每個課程添加學院和科系資訊
            if (courses && courses.length > 0) {
                courses.forEach(course => {
                    course.collegeId = college.collegeId;
                    course.collegeName = college.collegeName;
                    course.deptId = dept.deptId;
                    course.deptName = dept.deptName;
                });
                
                allCourses.push(...courses); // 將課程加入總陣列
                console.log(`    ✅ 獲取到 ${courses.length} 門課程`);
            }
        } catch (error) {
            console.error(`    ❌ 獲取 ${dept.deptName} 課程時發生錯誤:`, error.message);
        }
        
        // 添加延遲避免請求過於頻繁
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// 創建 data 目錄（如果不存在）
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 將所有課程輸出為 JSON 檔案
const outputPath = path.join(dataDir, 'courses.json');
fs.writeFileSync(outputPath, JSON.stringify(allCourses, null, 2), 'utf8');

console.log(`\n✅ 資料已儲存至: ${outputPath}`);
console.log(`📊 總共獲取了 ${allCourses.length} 門課程的資料`);

// 也可以按學院分別儲存
const collegeOutputPath = path.join(dataDir, 'courses_by_college.json');
const coursesByCollege = colleges.map(college => ({
    collegeId: college.collegeId,
    collegeName: college.collegeName,
    courses: allCourses.filter(course => course.collegeId === college.collegeId)
}));

fs.writeFileSync(collegeOutputPath, JSON.stringify(coursesByCollege, null, 2), 'utf8');
console.log(`✅ 按學院分類的資料已儲存至: ${collegeOutputPath}`);