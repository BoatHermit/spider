const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var results

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function get(page, season, username, region, mode) {
    console.log(`fetching season: ${season}, page: ${page}`);
    const url = `https://hearthstone.blizzard.com/en-us/api/community/leaderboardsData?region=${region}&leaderboardId=${mode}&page=${page}&seasonId=${season}`;
    try {
        const res = await fetch(url);
        const val = await res.json();
        const me = val.leaderboard.rows.find(r => r.accountid === username);
        if (me) {
            console.log("season: " + season);
            console.log("page: " + page);
            console.log(me);
            var result = {}

            results.push()
        } else if (page <= val.leaderboard.pagination.totalPages) {
            await get(page + 1, season, username, region, mode);
        } else {
            console.log("未找到");
        }
    } catch (error) {
        console.error("获取数据时出错: ", error);
    }
}

async function search(start_season, end_season, username, region, mode) {
    for (let i = start_season; i <= end_season; i++) {
        if (region == "CN") {
            console.log("国服查询功能未实现")
        } else {
            get(1, i, username, region, mode);
        }
    }
}

async function main() {
    try {
        const start_season = parseInt(await askQuestion('请输入查询起始赛季：'));
        const end_season = parseInt(await askQuestion('请输入查询终止赛季：'));
        const username = await askQuestion('请输入查询用户名：');
        const region = await askQuestion('请输入查询服务器(EU,US,AP)：');
        const mode = await askQuestion('请输入查询模式：');

        results = []
        await search(start_season, end_season, username, region, mode);
        console.log(results)
    } catch (error) {
        console.error("程序出错: ", error);
    } finally {
        rl.close();
    }
}

main();
