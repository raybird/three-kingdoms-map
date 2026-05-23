const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://zh.wikipedia.org/wiki/%E4%B8%89%E5%9B%BD';

console.log('正在從維基百科「三國」條目爬取歷史事件資訊...');

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept-Language': 'zh-TW,zh;q=0.9'
  }
};

https.get(url, options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`連線失敗，HTTP 狀態碼: ${res.statusCode}`);
    return;
  }

  let html = '';
  res.on('data', (chunk) => {
    html += chunk;
  });

  res.on('end', () => {
    try {
      console.log('頁面載入完成，開始解析事件與連結...');
      
      // 擷取歷史與軍事相關的 HTML 區段
      const historyStart = html.indexOf('id="歷史"');
      const historyEnd = html.indexOf('id="疆域"');
      let targetHtml = '';
      
      if (historyStart !== -1 && historyEnd !== -1) {
        targetHtml += html.substring(historyStart, historyEnd);
      }
      
      // 尋找 重要戰役 至 兵制
      const battleStart = html.indexOf('id="重要戰役"');
      const battleEnd = html.indexOf('id="兵制"');
      if (battleStart !== -1 && battleEnd !== -1) {
        targetHtml += html.substring(battleStart, battleEnd);
      }
      
      if (!targetHtml) {
        targetHtml = html;
      }

      // 使用 Regex 提取連結
      const linkRegex = /<a\s+[^>]*href="\/wiki\/([^"#?]+)"[^>]*title="([^"]+)"[^>]*>([^<]+)<\/a>/g;
      
      let match;
      const eventsMap = new Map();
      
      // 黑名單，排除常見的非事件詞條
      const blacklist = new Set([
        '三國', '魏', '蜀', '吳', '曹魏', '蜀漢', '東吳', '西晉', '東漢', 
        '皇帝', '朝代', '中國歷史', '二十四史', '漢朝', '晉朝', '九品中正制',
        '屯田制', '世兵制', '占田制', '戶調式', '府兵制', '部曲', '建安文學', 
        '建安七子', '三曹', '獨尊儒術', '玄學', '佛教', '道教', '太平道',
        '五斗米道', '江南', '遼東', '中原', '西域', '漢獻帝', '曹操', '劉備',
        '孫權', '司馬炎', '諸葛亮', '司馬懿', '周瑜', '陸遜', '董卓', '袁紹'
      ]);

      while ((match = linkRegex.exec(targetHtml)) !== null) {
        const rawUrl = match[1];
        const title = match[2];
        const text = match[3].trim();
        
        let decodedTitle = '';
        try {
          decodedTitle = decodeURIComponent(rawUrl);
        } catch (e) {
          decodedTitle = title;
        }

        // 過濾與比對機制
        if (
          !blacklist.has(text) &&
          !blacklist.has(decodedTitle) &&
          text.length >= 3 && text.length <= 12 &&
          !decodedTitle.includes(':') &&
          !decodedTitle.includes('%') &&
          (
            text.includes('戰') || 
            text.includes('役') || 
            text.includes('之') || 
            text.includes('亂') || 
            text.includes('變') || 
            text.includes('起義') ||
            text.includes('同盟') ||
            text.includes('政變') ||
            text.includes('討伐')
          )
        ) {
          eventsMap.set(text, {
            title: text,
            wikiUrl: `https://zh.wikipedia.org/wiki/${decodedTitle}`,
            suggestedPeriod: text.includes('之戰') || text.includes('之役') ? '重要戰役' : '歷史事件'
          });
        }
      }

      const results = Array.from(eventsMap.values());
      
      console.log(`解析完成！共提取出 ${results.length} 個符合條件的三國事件/戰役連結。`);
      
      const outputPath = path.join(__dirname, '..', 'public', 'assets', 'data', 'wiki-events-suggest.json');
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
      console.log(`建議事件清單已成功寫入至: ${outputPath}`);
      
    } catch (error) {
      console.error('解析網頁內容時發生錯誤:', error);
    }
  });
}).on('error', (err) => {
  console.error('請求維基百科頁面時發生錯誤:', err.message);
});
